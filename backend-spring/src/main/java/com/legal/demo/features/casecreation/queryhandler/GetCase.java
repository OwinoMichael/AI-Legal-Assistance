package com.legal.demo.features.casecreation.queryhandler;

import com.legal.demo.Query;
import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.features.casecreation.CaseDTO.CaseResponseDTO;
import com.legal.demo.features.casecreation.CaseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class GetCase implements Query<Integer, CaseResponseDTO> {

    private final CaseRepository caseRepository;


    public GetCase(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;

    }

    @Override
    public ResponseEntity<CaseResponseDTO> execute(Integer id) {
        Case legalCase = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + id));

        return ResponseEntity.ok(mapToDto(legalCase));
    }

    private CaseResponseDTO mapToDto(Case caseEntity) {
        if (caseEntity == null) {
            return null;
        }

        CaseResponseDTO dto = new CaseResponseDTO();
        dto.setId(caseEntity.getId());
        dto.setTitle(caseEntity.getTitle());
        dto.setDescription(caseEntity.getDescription());
        dto.setCreatedAt(caseEntity.getCreatedAt());

        // Handle the User relationship - extract the user ID
        if (caseEntity.getUser() != null) {
            dto.setUserId(caseEntity.getUser().getId());
        }

        return dto;
    }
}
