package com.legal.demo.features.casecreation.queryhandler;

import com.legal.demo.domain.user.User;
import com.legal.demo.features.users.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String getUserIdByEmail(String email) {
        return userRepository.findUsersByEmail(email)
                .map(User::getId) // User needs getId() getter method
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}