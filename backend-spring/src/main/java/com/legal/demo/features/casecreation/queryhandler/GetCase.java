package com.legal.demo.features.casecreation.queryhandler;

import com.legal.demo.Query;
import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.features.casecreation.CaseDTO.CaseResponseDTO;
import com.legal.demo.features.casecreation.CaseMapper;
import com.legal.demo.features.casecreation.CaseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class GetCase implements Query<Integer, CaseResponseDTO> {

    private final CaseRepository caseRepository;
    private final CaseMapper caseMapper;

    public GetCase(CaseRepository caseRepository, CaseMapper caseMapper) {
        this.caseRepository = caseRepository;
        this.caseMapper = caseMapper;
    }

    @Override
    public ResponseEntity<CaseResponseDTO> execute(Integer id) {
        Case legalCase = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + id));

        return ResponseEntity.ok(caseMapper.toDto(legalCase));
    }
}
