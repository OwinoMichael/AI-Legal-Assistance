package com.legal.demo.features.casecreation.queryhandler;

import com.legal.demo.Query;
import com.legal.demo.application.security.JWTUtil;
import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.domain.user.User;
import com.legal.demo.features.casecreation.CaseDTO.CaseResponseDTO;
import com.legal.demo.features.casecreation.CaseRepository;
import com.legal.demo.features.casecreation.commandhandler.CreateCase;
import com.legal.demo.features.users.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class GetAllCases implements Query<UserCaseQueryParams, Page<CaseResponseDTO>> {

    private final CaseRepository caseRepository;
    private static final Logger logger = LoggerFactory.getLogger(GetAllCases.class);

    public GetAllCases(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    @Override
    public ResponseEntity<Page<CaseResponseDTO>> execute(UserCaseQueryParams input) {
        CaseQueryParams params = input.getQueryParams();
        String userId = input.getUserId();

        long count = caseRepository.count();
        long userCount = caseRepository.findByUser_Id("be8110a8-3bd4-45f8-9bd2-1f415648cf86", Pageable.unpaged())
                .getTotalElements();
        logger.info("Total cases: {}, User cases: {}", count, userCount);


        // Use INFO level to ensure we see the logs
        logger.info("=== STARTING GetAllCases.execute() ===");
        logger.info("Fetching cases for user: {}", userId);
        logger.info("Query params - Page: {}, Size: {}, SortBy: {}, Direction: {}",
                params.getPage(), params.getSize(), params.getSortBy(), params.getSortDirection());

        if (userId == null || userId.trim().isEmpty()) {
            logger.error("UserId is null or empty!");
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }

        Pageable pageable = PageRequest.of(
                params.getPage(),
                params.getSize(),
                Sort.by(params.getSortDirection(), params.getSortBy())
        );

        logger.info("About to query repository with userId: {}", userId);
        Page<Case> cases = caseRepository.findByUser_Id(userId, pageable);
        logger.info("Repository returned {} total cases for user: {}", cases.getTotalElements(), userId);
        logger.info("Current page has {} cases", cases.getNumberOfElements());

        Page<CaseResponseDTO> caseDtoPage = cases.map(this::mapToDto);

        logger.info("=== COMPLETED GetAllCases.execute() ===");
        return ResponseEntity.ok(caseDtoPage);
    }



    private CaseResponseDTO mapToDto(Case caseEntity) {
        if (caseEntity == null) {
            return null;
        }

        CaseResponseDTO dto = new CaseResponseDTO();
        dto.setId(caseEntity.getId());
        dto.setTitle(caseEntity.getTitle());
        dto.setDescription(caseEntity.getDescription());
        dto.setDocuments(caseEntity.getDocuments().size());
        dto.setCreatedAt(caseEntity.getCreatedAt());
        dto.setUpdatedAt(caseEntity.getUpdatedAt());

        // Handle the User relationship - extract the user ID
        if (caseEntity.getUser() != null) {
            dto.setUserId(caseEntity.getUser().getId());
        }

        return dto;
    }
}


