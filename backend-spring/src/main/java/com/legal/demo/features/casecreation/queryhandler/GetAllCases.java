package com.legal.demo.features.casecreation.queryhandler;

import com.legal.demo.Query;
import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.features.casecreation.CaseDTO.CaseResponseDTO;
import com.legal.demo.features.casecreation.CaseRepository;
import com.legal.demo.features.casecreation.commandhandler.CreateCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class GetAllCases implements Query<CaseQueryParams, Page<CaseResponseDTO>> {

    private final CaseRepository caseRepository;
    private static final Logger logger = LoggerFactory.getLogger(GetAllCases.class);


    public GetAllCases(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;

    }

    @Override
    public ResponseEntity<Page<CaseResponseDTO>> execute(CaseQueryParams params) {
        Pageable pageable = PageRequest.of(
                params.getPage(),
                params.getSize(),
                Sort.by(params.getSortDirection(), params.getSortBy())
        );

        Page<Case> cases = caseRepository.findAll(pageable);
        logger.info("Fetching all cases");
        logger.info("Sort By: {}", params.getSortBy());
        logger.info("Direction: {}", params.getSortDirection());

        // Manual mapping without using CaseMapper
        Page<CaseResponseDTO> caseDtoPage = cases.map(this::mapToDto);

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


