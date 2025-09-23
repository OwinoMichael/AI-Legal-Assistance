package com.legal.demo.features.auth.service;

import com.legal.demo.Command;
import com.legal.demo.application.security.JWTUtil;
import com.legal.demo.domain.user.User;
import com.legal.demo.features.auth.events.UserRegistrationEventObject;
import com.legal.demo.features.auth.models.UserRegistrationRequest;
import com.legal.demo.features.users.UserRepository;
import org.apache.poi.ss.formula.functions.T;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional
public class RegistrationService implements Command<UserRegistrationRequest, T> {

    private final UserRepository usersRepository;
    private final PasswordEncoder encoder;
    private final JWTUtil jwtUtil;
    private final ApplicationEventPublisher eventPublisher;
    private static final Logger logger = LoggerFactory.getLogger(RegistrationService.class);


    public RegistrationService(UserRepository usersRepository, PasswordEncoder encoder, JWTUtil jwtUtil, ApplicationEventPublisher eventPublisher) {
        this.usersRepository = usersRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.eventPublisher = eventPublisher;
    }


    @Override
    public ResponseEntity execute(UserRegistrationRequest request) {
        try {
            Optional<User> existingUser = usersRepository.findUsersByEmail(request.getEmail());

            if(existingUser.isPresent()){
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("User with this email already exists");
            }

            User user = new User();
            // Don't set ID - @PrePersist will handle it
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setCases(new ArrayList<>());
            user.setPassword(encoder.encode(request.getPassword()));
            user.setEnabled(false);

            User savedUser = usersRepository.save(user);

            // Generate verification token
            String verificationToken = jwtUtil.generateToken(savedUser.getEmail());
            eventPublisher.publishEvent(new UserRegistrationEventObject(savedUser.getEmail(), verificationToken));

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Registration successful. Please check your email for verification.");

        } catch (Exception e) {
            logger.error("Service execution failed", e);
            throw e;
        }
    }
}
