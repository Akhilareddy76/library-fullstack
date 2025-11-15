package com.akhila.library.lib.controller;

import com.akhila.library.lib.model.User;
import com.akhila.library.lib.repository.UserRepository;
import com.akhila.library.lib.service.OtpService;
import com.akhila.library.lib.model.ResetPasswordRequest;
import com.akhila.library.lib.model.OtpEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final OtpService otpService;

    public PasswordController(OtpService otpService) {
        this.otpService = otpService;
    }

    // ==============================
    // SEND OTP FOR FORGOT PASSWORD
    // ==============================
    @PostMapping("/forgot")
    public String forgot(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        Optional<User> userOpt = userRepo.findFirstByEmail(email);
        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email not registered");
        }

        otpService.sendOtp(email);
        return "OTP_SENT";
    }

    // ==============================
    // VERIFY OTP
    // ==============================
    @PostMapping("/verify")
    public String verify(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        if (email == null || otp == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing email or OTP");
        }

        boolean valid = otpService.verifyOtp(email, otp);

        if (!valid)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired OTP");

        return "OTP_VERIFIED";
    }

    // ==============================
    // RESET PASSWORD
    // ==============================
    @PostMapping("/reset")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {

        OtpEntry entry = otpService.get(request.getEmail());

        if (entry == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No OTP found. Try again.");
        }

        if (entry.getExpiryTime().isBefore(Instant.now())) {
            otpService.clear(request.getEmail());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired. Request a new one.");
        }

        if (!entry.getOtp().equals(request.getOtp())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP.");
        }

        User user = userRepo.findFirstByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);

        otpService.clear(request.getEmail());
        return "PASSWORD_RESET_SUCCESS";
    }
}
