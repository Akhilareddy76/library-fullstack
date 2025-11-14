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

    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @PostMapping("/forgot")
    public String forgot(@RequestParam String email) {
        User user = getUserByEmail(email);

        if (user == null) {
            return "Email not registere";
        }

        otpService.sendOtp(email);
        return "If the email exists, an OTP has been sent.";
    }

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

        String encoded = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encoded);
        userRepo.save(user);


        otpService.clear(request.getEmail());

        return "Password reset successful!";
    }
}

