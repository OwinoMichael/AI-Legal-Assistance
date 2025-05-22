package com.legal.demo.features.auth.service;

import com.legal.demo.Command;
import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.application.security.JWTUtil;
import com.legal.demo.domain.user.User;
import com.legal.demo.features.auth.ResendVerificationContext;
import com.legal.demo.features.auth.events.UserRegistrationEvent;
import com.legal.demo.features.auth.models.ResendVerificationRequest;
import com.legal.demo.features.users.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.tika.exception.TikaException;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.IOException;

@Service
public class ResendEmailVerificationService implements Command<ResendVerificationContext, String> {
    private final UserRepository userRepository;
    private final RateLimitService rateLimitService;
    private final JWTUtil jwtUtil;
    private final ApplicationEventPublisher eventPublisher;


    public ResendEmailVerificationService(UserRepository userRepository, RateLimitService rateLimitService, JWTUtil jwtUtil, ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.rateLimitService = rateLimitService;
        this.jwtUtil = jwtUtil;
        this.eventPublisher = eventPublisher;

    }


    @Override
    public ResponseEntity<String> execute(ResendVerificationContext context) throws TikaException, IOException, SAXException {
        // Extract values from context
        ResendVerificationRequest request = context.getRequest();
        HttpServletRequest httpRequest = context.getHttpRequest();

        // 1. Rate limiting check
        String ip = httpRequest.getRemoteAddr();
        if (!rateLimitService.isAllowed("email_resend", ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many requests. Try again later.");
        }

        // 2. Find and validate user
        User user = userRepository.findUsersByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + request.getEmail()));

        if (user.isEnabled()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already verified");
        }

        // 3. Generate and send new token
        String verificationToken = jwtUtil.generateToken(user.getEmail());
        eventPublisher.publishEvent(new UserRegistrationEvent(
                user.getEmail(),
                verificationToken,
                true // isResend flag
        ));

        return ResponseEntity.ok("Verification email resent");
    }
}
