package com.legal.demo.features.documentupload.commandhandler;

import com.legal.demo.Command;
import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.domain.legalcase.Case;
import com.legal.demo.domain.legalcase.Document;
import com.legal.demo.features.casecreation.CaseRepository;
import com.legal.demo.features.documentupload.DocumentRepository;
import org.apache.tika.exception.TikaException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.IOException;

@Service
public class DeleteDocument implements Command<Integer, Void> {

    private final DocumentRepository documentRepository;
    private final CaseRepository caseRepository;
    private final FileStorageService fileStorageService;

    public DeleteDocument(DocumentRepository documentRepository, CaseRepository caseRepository, FileStorageService fileStorageService) {
        this.documentRepository = documentRepository;
        this.caseRepository = caseRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public ResponseEntity<Void> execute(Integer id) {
        try {
            Document document = documentRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

            fileStorageService.deleteFileWithException(document.getFileName());
            documentRepository.delete(document);


            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace(); // Print full error to logs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}


