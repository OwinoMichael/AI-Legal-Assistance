package com.legal.demo.features.auth.service;

import com.legal.demo.Command;
import com.legal.demo.application.security.JWTUtil;
import com.legal.demo.domain.user.User;
import com.legal.demo.features.users.UserRepository;
import org.apache.poi.ss.formula.functions.T;
import org.apache.tika.exception.TikaException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.IOException;

@Service
public class EmailVerificationService implements Command<String, String> {


    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;

    public EmailVerificationService(UserRepository userRepository, JWTUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public ResponseEntity<String> execute(String token) throws TikaException, IOException, SAXException {
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findUsersByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(true);
        userRepository.save(user);

        return ResponseEntity.ok("Email verified successfully");
    }
}
