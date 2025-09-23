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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(CreateCase.class);

    public CreateCase(CaseRepository caseRepository, UserRepository userRepository) {
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<CaseResponseDTO> execute(CaseDTO caseDTO) {
        logger.info("Creating case with title: {} for user: {}", caseDTO.getTitle(), caseDTO.getUserId());

        try {
            // Validate business rules
            if (caseRepository.existsByTitle(caseDTO.getTitle())) {
                logger.warn("Case title already exists: {}", caseDTO.getTitle());
                throw new BusinessValidationException("Case title already exists");
            }

            logger.info("Looking for user with ID: {}", caseDTO.getUserId());
            User user = userRepository.findById(caseDTO.getUserId())
                    .orElseThrow(() -> {
                        logger.error("User not found with ID: {}", caseDTO.getUserId());
                        return new ResourceNotFoundException("User not found");
                    });

            logger.info("Found user: {}", user.getEmail());

            // Create and save entity
            Case newCase = new Case();
            newCase.setTitle(caseDTO.getTitle());
            newCase.setDescription(caseDTO.getDescription());
            newCase.setUser(user);
            newCase.setCreatedAt(LocalDate.now());
            newCase.setUpdatedAt(LocalDate.now());

            logger.info("Saving case to database...");
            Case savedCase = caseRepository.save(newCase);
            logger.info("Case saved successfully with ID: {}", savedCase.getId());

            user.getCases().add(savedCase);
            userRepository.save(user);


            // Convert to response DTO
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(mapToResponseDTO(savedCase));

        } catch (Exception e) {
            logger.error("Error creating case", e);
            throw e; // Re-throw to be handled by global exception handler
        }
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