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

import java.time.Instant;
import java.util.Map;

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

    // Reusable helper method
    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    // ------------------------ FORGOT PASSWORD ------------------------
    @PostMapping("/forgot")
    public String forgot(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (email == null || email.isBlank()) {
            return "Email is required";
        }

        User user = getUserByEmail(email);

        if (user == null) {
            return "Email not registered";
        }

        otpService.sendOtp(email);
        return "OTP sent to your email.";
    }

    @PostMapping("/verify")
    public String verify(@RequestParam String email, @RequestParam String otp) {

        OtpEntry entry = otpService.get(email);

        if (entry == null) {
            return "No OTP found";
        }

        if (entry.getExpiryTime().isBefore(Instant.now())) {
            otpService.clear(email);
            return "OTP expired";
        }

        if (!entry.getOtp().equals(otp)) {
            return "Invalid OTP";
        }

        return "valid";
    }
    // ------------------------ RESET PASSWORD ------------------------
    @PostMapping("/reset")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {

        OtpEntry entry = otpService.get(request.getEmail());

        if (entry == null) {
            return "No OTP found. Try again.";
        }

        if (entry.getExpiryTime().isBefore(Instant.now())) {
            otpService.clear(request.getEmail());
            return "OTP expired. Request a new one.";
        }

        if (!entry.getOtp().equals(request.getOtp())) {
            return "Invalid OTP.";
        }

        User user = userRepo.findByEmail(request.getEmail());
        if (user == null) {
            return "User not found";
        }

        // Update password
        String encoded = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encoded);
        userRepo.save(user);

        otpService.clear(request.getEmail());
        return "Password reset successful!";
    }
}
