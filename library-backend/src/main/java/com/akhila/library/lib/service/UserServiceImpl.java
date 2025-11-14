package com.akhila.library.lib.service;

import com.akhila.library.lib.model.User;
import com.akhila.library.lib.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User registerUser(User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("EMAIL_EXISTS");
        }
        String hashed = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashed);
        return userRepo.save(user);
    }

    @Override
    public User loginUser(String email, String password) {
        Optional<User> optional = userRepo.findFirstByEmail(email);
        if (optional.isPresent()) {
            User user = optional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    @Override
    public User getUserById(Long id) {
        return userRepo.findById(id).orElse(null);
    }
}
