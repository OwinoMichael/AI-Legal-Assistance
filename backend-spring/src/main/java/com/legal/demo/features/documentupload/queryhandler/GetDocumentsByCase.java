package com.legal.demo.features.documentupload.queryhandler;

import com.legal.demo.Query;
import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.domain.legalcase.Document;
import com.legal.demo.features.casecreation.CaseRepository;
import com.legal.demo.features.documentupload.DocumentDTO.DocumentResponseDTO;
import com.legal.demo.features.documentupload.DocumentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@Service
public class GetDocumentsByCase implements Query<Integer, List<DocumentResponseDTO>> {

    private final DocumentRepository documentRepository;
    private final CaseRepository caseRepository;

    public GetDocumentsByCase(DocumentRepository documentRepository, CaseRepository caseRepository) {
        this.documentRepository = documentRepository;
        this.caseRepository = caseRepository;
    }

    @Override
    public ResponseEntity<List<DocumentResponseDTO>> execute(Integer id) {
        Case legalCase = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case"));

        //Only fetch documents for that case
        List<Document> documents = documentRepository.findByLegalCaseId(id);

        return ResponseEntity.ok(documentToDTO(documents));
    }


    public List<DocumentResponseDTO> documentToDTO(List<Document> documents) {
        return documents.stream().map(doc -> {
            DocumentResponseDTO dto = new DocumentResponseDTO();
            dto.setId(doc.getId());
            dto.setCaseId(doc.getLegalCase().getId());
            dto.setFileName(doc.getFileName());
            dto.setFileSize(doc.getFileSize());
            dto.setFileType(doc.getFileType());
            dto.setFilePath(doc.getFilePath());
            dto.setDownloadUrl("/downloads"); // Ideally make this dynamic
            dto.setCreatedAt(doc.getCreatedAt());
            return dto;
        }).toList();
    }

}
