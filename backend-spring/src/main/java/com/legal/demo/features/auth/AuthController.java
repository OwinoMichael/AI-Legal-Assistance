package com.legal.demo.features.auth;

import com.legal.demo.application.security.SecurityConfig;
import com.legal.demo.domain.user.User;
import com.legal.demo.features.auth.service.LoginService;
import com.legal.demo.features.auth.service.RegistrationService;
import com.legal.demo.features.users.UserRepository;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@RestController

public class AuthController {

    private final RegistrationService registrationService;
    private final LoginService loginService;

    public AuthController(RegistrationService registrationService, LoginService loginService) {
        this.registrationService = registrationService;
        this.loginService = loginService;
    }

    @PostMapping("/login")
        public ResponseEntity login(@RequestBody LoginRequest request) throws TikaException, IOException, SAXException {

            return loginService.execute(request);

        }

        @PostMapping("/createNewUser")
        public ResponseEntity createNewUser(@RequestBody User request) throws TikaException, IOException, SAXException {

            return registrationService.execute(request);
        }

}
