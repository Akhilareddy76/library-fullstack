package com.akhila.library.lib.controller;

import com.akhila.library.lib.model.User;
import com.akhila.library.lib.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "*")  // Allow frontend calls
public class PasswordController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // =============================
    // RESET PASSWORD (NO OTP)
    // =============================
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String newPassword = req.get("newPassword");

        if (email == null || newPassword == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email and new password required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(400)
                    .body(Map.of("message", "Email not registered"));
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }
}
