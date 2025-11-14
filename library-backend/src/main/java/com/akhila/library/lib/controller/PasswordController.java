package com.akhila.library.lib.controller;

import com.akhila.library.lib.model.User;
import com.akhila.library.lib.repository.UserRepository;
import com.akhila.library.lib.service.OtpService;
import com.akhila.library.lib.service.UserService;
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
    private final UserService userService;

    public PasswordController(OtpService otpService, UserService userService) {
        this.otpService = otpService;
        this.userService = userService;
    }

    // helper
    private Optional<User> findByEmailOptional(String email) {
        return userRepo.findFirstByEmail(email);
    }

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

        try {
            otpService.sendOtp(email);
            return "OTP_SENT";
        }
        catch (RuntimeException ex) {
            if (ex.getMessage().equals("OTP_SEND_FAILED")) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to send OTP");
            }
            throw ex;
        }
    }


    @PostMapping("/verify")
    public String verify(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        if (email == null || otp == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing email or otp");
        }
        boolean ok = otpService.verifyOtp(email, otp);
        if (!ok) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired OTP");
        return "OTP verified";
    }

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

        User user = userRepo.findFirstByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
        }

        String encoded = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encoded);
        userRepo.save(user);

        otpService.clear(request.getEmail());
        return "Password reset successful!";
    }
}
