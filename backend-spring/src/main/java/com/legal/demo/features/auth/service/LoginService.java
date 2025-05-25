package com.legal.demo.features.auth.service;

import com.legal.demo.Command;
import com.legal.demo.application.security.JWTUtil;
import com.legal.demo.domain.user.User;
import com.legal.demo.features.auth.models.JWTLoginResponse;
import com.legal.demo.features.auth.models.LoginRequest;
import com.legal.demo.features.users.UserRepository;
import org.apache.poi.ss.formula.functions.T;
import org.apache.tika.exception.TikaException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.Map;

@Service
public class LoginService implements Command<LoginRequest, T> {

    private final AuthenticationManager authenticationManager;
    private final UserRepository usersRepository;
    private final PasswordEncoder encoder;
    private final JWTUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public LoginService(AuthenticationManager authenticationManager, UserRepository usersRepository, PasswordEncoder encoder, JWTUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.usersRepository = usersRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ResponseEntity execute(LoginRequest request) throws TikaException, IOException, SAXException {
        // Add debugging
        System.out.println("Received LoginRequest: " + request);
        System.out.println("Email: '" + request.getEmail() + "'");
        System.out.println("Password: " + (request.getPassword() != null ? "[PROVIDED]" : "[NULL]"));

        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "INVALID_INPUT", "message", "Email is required"));
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "INVALID_INPUT", "message", "Password is required"));
        }

        try {
            // First, check if user exists and get their details
            System.out.println("Looking up user with email: " + request.getEmail().trim());
            User user = usersRepository.findUsersByEmail(request.getEmail().trim())
                    .orElse(null);

            if (user == null) {
                System.out.println("User not found for email: " + request.getEmail());
                // User doesn't exist - return invalid credentials
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "INVALID_CREDENTIALS", "message", "Invalid email or password"));
            }

            System.out.println("User found: " + user.getEmail() + ", enabled: " + user.isEnabled());

            // Check if user is verified BEFORE authentication
            if (!user.isEnabled()) {
                System.out.println("User not verified: " + user.getEmail());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "error", "ACCOUNT_NOT_VERIFIED",
                                "message", "Please verify your email before logging in",
                                "email", user.getEmail()
                        ));
            }

            // Now authenticate the verified user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail().trim(), request.getPassword())
            );

            // Generate token for verified and authenticated user
            String token = jwtUtil.generateToken(user.getEmail());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "email", user.getEmail(),
                    "verified", true
            ));

        } catch (BadCredentialsException e) {
            System.out.println("Authentication failed for user: " + request.getEmail());
            // This will now only catch actual password mismatches
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "INVALID_CREDENTIALS", "message", "Invalid email or password"));
        } catch (Exception e) {
            System.out.println("Unexpected error during login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "SERVER_ERROR", "message", "An error occurred during login"));
        }
    }
}
