package com.legal.demo.features.documentupload;


import com.legal.demo.features.documentupload.DocumentDTO.DocumentResponseDTO;
import com.legal.demo.features.documentupload.DocumentDTO.DocumentUploadDTO;
import com.legal.demo.features.documentupload.commandhandler.DeleteDocument;
import com.legal.demo.features.documentupload.queryhandler.DownloadDocument;
import com.legal.demo.features.documentupload.commandhandler.UploadDocument;
import com.legal.demo.features.documentupload.queryhandler.GetDocumentsByCase;
import jakarta.validation.Valid;
import org.apache.tika.exception.TikaException;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final UploadDocument uploadDocument;
    private final DownloadDocument downloadDocument;
    private final DeleteDocument deleteDocument;
    private final GetDocumentsByCase getDocumentsByCase;

    public DocumentController(UploadDocument uploadDocument, DownloadDocument downloadDocument, DeleteDocument deleteDocument, GetDocumentsByCase getDocumentsByCase) {
        this.uploadDocument = uploadDocument;
        this.downloadDocument = downloadDocument;
        this.deleteDocument = deleteDocument;
        this.getDocumentsByCase = getDocumentsByCase;
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentResponseDTO> uploadDocument(@Valid @ModelAttribute DocumentUploadDTO documentDTO){
        return uploadDocument.execute(documentDTO);

    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName){
        return downloadDocument.execute(fileName);
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<List<DocumentResponseDTO>> getDocumentsByCase(@PathVariable Integer caseId) {
        return getDocumentsByCase.execute(caseId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Integer id) throws TikaException, IOException, SAXException {
        return deleteDocument.execute(id);
    }

}
