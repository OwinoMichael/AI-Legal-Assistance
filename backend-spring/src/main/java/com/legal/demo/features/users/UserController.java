package com.legal.demo.features.users;

import com.legal.demo.domain.user.User;
import com.legal.demo.features.users.queryHandler.GetUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final GetUser getUser;

    public UserController(GetUser getUser) {
        this.getUser = getUser;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable @Valid String id){
        return getUser.execute(id);
    }
}
