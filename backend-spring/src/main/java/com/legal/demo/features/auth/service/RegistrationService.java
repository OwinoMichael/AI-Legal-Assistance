package com.legal.demo.features.auth.service;

import com.legal.demo.Command;
import com.legal.demo.domain.user.User;
import com.legal.demo.features.users.UserRepository;
import org.apache.poi.ss.formula.functions.T;
import org.apache.tika.exception.TikaException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
public class RegistrationService implements Command<User, T> {

    private final UserRepository usersRepository;
    private final PasswordEncoder encoder;

    public RegistrationService(UserRepository usersRepository, PasswordEncoder encoder) {
        this.usersRepository = usersRepository;
        this.encoder = encoder;
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
        usersRepository.save(user);
        return ResponseEntity.ok("success");
    }
}
