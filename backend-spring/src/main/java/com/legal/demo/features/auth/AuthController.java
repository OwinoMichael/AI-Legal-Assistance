package com.legal.demo.features.auth;

import com.legal.demo.domain.user.User;
import com.legal.demo.features.auth.models.LoginRequest;
import com.legal.demo.features.auth.models.ResendVerificationRequest;
import com.legal.demo.features.auth.models.UserRegistrationRequest;
import com.legal.demo.features.auth.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.apache.tika.exception.TikaException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.Map;

import static com.mysql.cj.conf.PropertyKey.logger;

@RestController
@RequestMapping("/")
public class AuthController {

    private final RegistrationService registrationService;
    private final EmailVerificationService emailVerificationService;
    private final ResendEmailVerificationService resendEmailVerificationService;
    private final LoginService loginService;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthController(RegistrationService registrationService, EmailVerificationService emailVerificationService, ResendEmailVerificationService resendEmailVerificationService, LoginService loginService) {
        this.registrationService = registrationService;
        this.emailVerificationService = emailVerificationService;
        this.resendEmailVerificationService = resendEmailVerificationService;

        this.loginService = loginService;
    }

    @PostMapping("/createNewUser")
    public ResponseEntity<?> createNewUser(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            return registrationService.execute(request);
        } catch (Exception e) {
            // Log the actual error
            logger.error("Registration failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }


    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam String token) throws TikaException, IOException, SAXException {
        return emailVerificationService.execute(token);
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest) throws TikaException, IOException, SAXException {
        try {
            return loginService.execute(loginRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "SERVER_ERROR", "message", "Login failed"));
        }
    }


    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestBody ResendVerificationRequest request,
                                                     HttpServletRequest httpRequest) throws TikaException, IOException, SAXException {
        ResendVerificationContext context = new ResendVerificationContext(request, httpRequest);

        return resendEmailVerificationService.execute(context);
    }

}
