package com.legal.demo.features.casecreation.commandhandler;

import com.legal.demo.Command;
import com.legal.demo.application.exceptions.BusinessValidationException;
import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.domain.user.User;
import com.legal.demo.features.casecreation.CaseDTO.CaseDTO;
import com.legal.demo.features.casecreation.CaseDTO.CaseResponseDTO;
import com.legal.demo.features.casecreation.CaseRepository;
import com.legal.demo.features.users.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
public class CreateCase implements Command<CaseDTO, CaseResponseDTO> {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    public CreateCase(CaseRepository caseRepository, UserRepository userRepository) {
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<CaseResponseDTO> execute(CaseDTO caseDTO) {
        // Validate business rules
        if (caseRepository.existsByTitle(caseDTO.getTitle())) {
            throw new BusinessValidationException("Case title already exists");
        }

        User user = userRepository.findById(caseDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Create and save entity
        Case newCase = new Case();
        newCase.setTitle(caseDTO.getTitle());
        newCase.setDescription(caseDTO.getDescription());
        newCase.setUser(user);
        newCase.setCreatedAt(LocalDate.now());
        newCase.setUpdatedAt(LocalDate.now());

        Case savedCase = caseRepository.save(newCase);

        // Convert to response DTO
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapToResponseDTO(savedCase));
    }

    private CaseResponseDTO mapToResponseDTO(Case legalCase) {
        CaseResponseDTO response = new CaseResponseDTO();
        response.setId(legalCase.getId());
        response.setTitle(legalCase.getTitle());
        response.setDescription(legalCase.getDescription());
        response.setCreatedAt(legalCase.getCreatedAt());
        response.setUserId(legalCase.getUser().getId());
        return response;
    }
}