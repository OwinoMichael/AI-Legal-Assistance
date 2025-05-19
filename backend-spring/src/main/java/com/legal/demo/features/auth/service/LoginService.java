package com.legal.demo.features.auth.service;

import com.legal.demo.Command;
import com.legal.demo.application.security.SecurityConfig;
import com.legal.demo.domain.user.User;
import com.legal.demo.features.auth.JWTLoginResponse;
import com.legal.demo.features.auth.LoginRequest;
import com.legal.demo.features.users.UserRepository;
import org.apache.poi.ss.formula.functions.T;
import org.apache.tika.exception.TikaException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.IOException;

@Service
public class LoginService implements Command<LoginRequest, T> {

    private final AuthenticationManager authenticationManager;
    private final UserRepository usersRepository;
    private final PasswordEncoder encoder;

    public LoginService(AuthenticationManager authenticationManager, UserRepository usersRepository, PasswordEncoder encoder) {
        this.authenticationManager = authenticationManager;
        this.usersRepository = usersRepository;
        this.encoder = encoder;
    }

    @Override
    public ResponseEntity execute(LoginRequest request) throws TikaException, IOException, SAXException {
        try {
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            );

            Authentication authentication = authenticationManager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = usersRepository.findUsersByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            String jwtToken = SecurityConfig.JWTUtil.generateToken(request.getEmail());
            return ResponseEntity.ok(new JWTLoginResponse(jwtToken, user.getEmail()));


        }catch (AuthenticationException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
        }
    }
}
