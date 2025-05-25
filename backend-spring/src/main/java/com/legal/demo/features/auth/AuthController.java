package com.legal.demo.features.auth;

import com.legal.demo.domain.user.User;
import com.legal.demo.features.auth.models.LoginRequest;
import com.legal.demo.features.auth.models.ResendVerificationRequest;
import com.legal.demo.features.auth.service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.tika.exception.TikaException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.xml.sax.SAXException;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final RegistrationService registrationService;
    private final EmailVerificationService emailVerificationService;
    private final ResendEmailVerificationService resendEmailVerificationService;
    private final LoginService loginService;

    public AuthController(RegistrationService registrationService, EmailVerificationService emailVerificationService, ResendEmailVerificationService resendEmailVerificationService, LoginService loginService) {
        this.registrationService = registrationService;
        this.emailVerificationService = emailVerificationService;
        this.resendEmailVerificationService = resendEmailVerificationService;

        this.loginService = loginService;
    }

    @PostMapping("/createNewUser")
    public ResponseEntity createNewUser(@RequestBody User request) throws TikaException, IOException, SAXException {

        return registrationService.execute(request);
    }


    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam String token) throws TikaException, IOException, SAXException {
        return emailVerificationService.execute(token);
    }

    @PostMapping("/login")
    public ResponseEntity login(LoginRequest loginRequest) throws TikaException, IOException, SAXException {
        return loginService.execute(loginRequest);
    }


    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestBody ResendVerificationRequest request,
                                                     HttpServletRequest httpRequest) throws TikaException, IOException, SAXException {
        ResendVerificationContext context = new ResendVerificationContext(request, httpRequest);

        return resendEmailVerificationService.execute(context);
    }

}
