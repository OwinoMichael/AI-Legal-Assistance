package com.legal.demo.features.casecreation.queryhandler;

import com.legal.demo.Query;
import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.features.casecreation.CaseDTO.CaseResponseDTO;
import com.legal.demo.features.casecreation.CaseMapper;
import com.legal.demo.features.casecreation.CaseRepository;
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
    private final CaseMapper caseMapper;

    public GetAllCases(CaseRepository caseRepository, CaseMapper caseMapper) {
        this.caseRepository = caseRepository;
        this.caseMapper = caseMapper;
    }

    @Override
    public ResponseEntity<Page<CaseResponseDTO>> execute(CaseQueryParams params) {
        Pageable pageable = PageRequest.of(
                params.getPage(),
                params.getSize(),
                Sort.by(params.getSortDirection(), params.getSortBy())
        );

        Page<Case> cases = caseRepository.findAll(pageable);

        return ResponseEntity.ok(cases.map(caseMapper::toDto));
    }
}


