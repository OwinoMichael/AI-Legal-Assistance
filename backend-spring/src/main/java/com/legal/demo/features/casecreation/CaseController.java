package com.legal.demo.features.casecreation;

import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.features.casecreation.CaseDTO.CaseDTO;
import com.legal.demo.features.casecreation.CaseDTO.CaseResponseDTO;
import com.legal.demo.features.casecreation.commandhandler.CreateCase;
import com.legal.demo.features.casecreation.queryhandler.CaseQueryParams;
import com.legal.demo.features.casecreation.queryhandler.GetAllCases;
import com.legal.demo.features.casecreation.queryhandler.GetCase;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/case")
public class CaseController {

    private final GetAllCases getAllCases;
    private final GetCase getCase;
    private final CreateCase createCase;

    public CaseController(GetAllCases getAllCases, GetCase getCase, CreateCase createCase) {
        this.getAllCases = getAllCases;
        this.getCase = getCase;
        this.createCase = createCase;
    }

    @GetMapping("/")
    public ResponseEntity<Page<CaseResponseDTO>> getAllCases(
            @Valid CaseQueryParams caseQueryParams
    ){
        return getAllCases.execute(null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaseResponseDTO> getCase(@RequestParam Integer id){
        return getCase.execute(id);
    }

    @PostMapping("/create-case")
    public ResponseEntity<CaseResponseDTO> creatCase(@RequestBody CaseDTO legalCase){
        return createCase.execute(legalCase);
    }
}
