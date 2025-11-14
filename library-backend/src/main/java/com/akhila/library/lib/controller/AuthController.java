package com.akhila.library.lib.controller;

import com.akhila.library.lib.model.User;
import com.akhila.library.lib.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public User register(@RequestBody User user, HttpSession session) {
        try {
            User savedUser = userService.registerUser(user);
            session.setAttribute("USER", savedUser.getId());
            return savedUser;

        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }
    }


    @PostMapping("/login")
    public User login(@RequestBody User user, HttpSession session) {

        User validUser = userService.loginUser(user.getEmail(), user.getPassword());

        if (validUser != null) {
            session.setAttribute("USER", validUser.getId());
            session.setMaxInactiveInterval(30 * 60);
            return validUser;
        }

        return null;
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logged out";
    }
    @GetMapping("/session-check")
    public User sessionCheck(HttpSession session) {

        Long userId = (Long) session.getAttribute("USER");

        if (userId == null) {
            return null;
        }

        return userService.getUserById(userId);
    }
}
