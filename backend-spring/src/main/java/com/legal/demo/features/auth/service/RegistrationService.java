package com.legal.demo.features.auth.service;

import com.legal.demo.Command;
import com.legal.demo.application.security.JWTUtil;
import com.legal.demo.application.security.SecurityConfig;
import com.legal.demo.domain.user.User;
import com.legal.demo.features.auth.events.UserRegistrationEvent;
import com.legal.demo.features.users.UserRepository;
import org.apache.poi.ss.formula.functions.T;
import org.apache.tika.exception.TikaException;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class RegistrationService implements Command<User, T> {

    private final UserRepository usersRepository;
    private final PasswordEncoder encoder;
    private final ApplicationEventPublisher eventPublisher;

    public RegistrationService(UserRepository usersRepository, PasswordEncoder encoder, ApplicationEventPublisher eventPublisher) {
        this.usersRepository = usersRepository;
        this.encoder = encoder;
        this.eventPublisher = eventPublisher;
    }


    @Override
    public ResponseEntity execute(User request) throws TikaException, IOException, SAXException {
        Optional<User> customUserOptional = usersRepository.findUsersByEmail(request.getEmail());


        if(customUserOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User name already exists");
        }

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setEnabled(false); // Explicitly set
        usersRepository.save(user);

        // Generate verification token
        String verificationToken = JWTUtil.generateToken(user.getEmail());

        // Publish event
        eventPublisher.publishEvent(new UserRegistrationEvent(user.getEmail(), verificationToken));

        return ResponseEntity.ok("success, please verify your email");
    }
}
