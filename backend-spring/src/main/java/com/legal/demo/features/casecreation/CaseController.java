package com.legal.demo.features.casecreation;

import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.features.casecreation.CaseDTO.CaseDTO;
import com.legal.demo.features.casecreation.CaseDTO.CaseResponseDTO;
import com.legal.demo.features.casecreation.commandhandler.CreateCase;
import com.legal.demo.features.casecreation.queryhandler.*;
import com.mysql.cj.log.Log;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cases")
public class CaseController {

    private final GetAllCases getAllCases;
    private final GetCase getCase;
    private final CreateCase createCase;
    private final UserService userService;
    public static final Logger logger = LoggerFactory.getLogger(CaseController.class);

    public CaseController(GetAllCases getAllCases, GetCase getCase, CreateCase createCase, UserService userService) {
        this.getAllCases = getAllCases;
        this.getCase = getCase;
        this.createCase = createCase;
        this.userService = userService;
    }

    @GetMapping("/")
    public ResponseEntity<Page<CaseResponseDTO>> getAllCases(
            @Valid CaseQueryParams caseQueryParams,
            Authentication authentication) {

        String email = (String) authentication.getPrincipal();
        logger.info("Authenticated user email: {}", email);

        String userId = userService.getUserIdByEmail(email);

        UserCaseQueryParams userCaseQuery = new UserCaseQueryParams(caseQueryParams, userId);

        return getAllCases.execute(userCaseQuery);
    }



    @GetMapping("/{id}")
    public ResponseEntity<CaseResponseDTO> getCase(@PathVariable Integer id){
        return getCase.execute(id);
    }

    @PostMapping("/create-case")
    public ResponseEntity<CaseResponseDTO> creatCase(@Valid @RequestBody CaseDTO legalCase){
        return createCase.execute(legalCase);
    }
}
