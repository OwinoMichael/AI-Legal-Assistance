package com.legal.demo.features.documentupload;


import com.legal.demo.features.documentupload.DocumentDTO.DocumentResponseDTO;
import com.legal.demo.features.documentupload.DocumentDTO.DocumentUploadDTO;
import com.legal.demo.features.documentupload.commandhandler.DownloadDocument;
import com.legal.demo.features.documentupload.commandhandler.UploadDocument;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/document")
public class DocumentController {

    private final UploadDocument uploadDocument;
    private final DownloadDocument downloadDocument;

    public DocumentController(UploadDocument uploadDocument, DownloadDocument downloadDocument) {
        this.uploadDocument = uploadDocument;
        this.downloadDocument = downloadDocument;
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentResponseDTO> uploadDocument(@Valid @ModelAttribute DocumentUploadDTO documentDTO){
        return uploadDocument.execute(documentDTO);

    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName){
        return downloadDocument.execute(fileName);
    }

}
