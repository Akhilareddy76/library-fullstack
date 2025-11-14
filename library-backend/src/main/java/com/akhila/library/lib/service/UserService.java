package com.akhila.library.lib.service;

import com.akhila.library.lib.model.User;


public interface UserService {
    User registerUser(User user);
    User loginUser(String email,String password);
    User getUserById(Long id);

}
