package com.legal.demo.features.documentupload.commandhandler;

import com.legal.demo.Command;
import com.legal.demo.application.exceptions.FileStorageException;
import com.legal.demo.application.exceptions.GlobalExceptionHandler;
import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.domain.legalcase.Document;
import com.legal.demo.features.casecreation.CaseRepository;
import com.legal.demo.features.documentupload.DocumentDTO.DocumentResponseDTO;
import com.legal.demo.features.documentupload.DocumentDTO.DocumentUploadDTO;
import com.legal.demo.features.documentupload.DocumentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class UploadDocument implements Command<DocumentUploadDTO, DocumentResponseDTO> {

    private final DocumentRepository documentRepository;
    private final CaseRepository caseRepository;
    private final FileStorageService fileStorageService;

    public UploadDocument(DocumentRepository documentRepository,
                          CaseRepository caseRepository,
                          FileStorageService fileStorageService) {
        this.documentRepository = documentRepository;
        this.caseRepository = caseRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public ResponseEntity<DocumentResponseDTO> execute(DocumentUploadDTO documentDTO) {
        //Validate case exists
        Case legalCase = caseRepository
                .findById(documentDTO.getCaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id:" + documentDTO.getCaseId()));

        try{
            //Store file physically
            String storedFileName = fileStorageService.storeFile(documentDTO.getFile());

            //Save metadata
            Document document = new Document();
            document.setFileName(documentDTO.getFile().getOriginalFilename());
            document.setFilePath(storedFileName);
            document.setFileSize(documentDTO.getFile().getSize());
            document.setFileType(documentDTO.getFile().getContentType());
            document.setLegalCase(legalCase);

            Document savedDocument = documentRepository.save(document);

            return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDTO(savedDocument));

        }catch (IOException ex){
            throw new FileStorageException("Failed to store file" + ex.toString());
        }


    }

    private DocumentResponseDTO mapToResponseDTO(Document document) {
        DocumentResponseDTO response = new DocumentResponseDTO();
        response.setId(document.getId());
        response.setFileName(document.getFileName());
        response.setFileType(document.getFileType());
        response.setFileSize(document.getFileSize());
        response.setCreatedAt(document.getCreatedAt());
        response.setCaseId(document.getLegalCase().getId());
        response.setDownloadUrl("/documents/download/" + document.getFilePath());
        return response;
    }
}
