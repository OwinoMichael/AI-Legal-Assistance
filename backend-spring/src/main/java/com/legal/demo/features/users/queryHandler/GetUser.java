package com.legal.demo.features.users.queryHandler;


import com.legal.demo.Query;
import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.domain.user.User;
import com.legal.demo.features.users.UserRepository;
import com.legal.demo.features.users.UserResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class GetUser implements Query<String, UserResponseDTO> {

    private final UserRepository userRepository;

    public GetUser(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<UserResponseDTO> execute(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User"));

        return ResponseEntity.ok(mapToDTO(user));
    }

    private UserResponseDTO mapToDTO(User user){

        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(user.getId());
        userResponseDTO.setFirstName(user.getFirstName());
        userResponseDTO.setLastName(user.getLastName());
        userResponseDTO.setEmail(user.getEmail());

        return userResponseDTO;
    }
}
