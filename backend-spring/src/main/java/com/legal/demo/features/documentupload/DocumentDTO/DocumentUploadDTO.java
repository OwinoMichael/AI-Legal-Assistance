package com.legal.demo.features.documentupload.DocumentDTO;

import com.legal.demo.application.validation.FileConstraints;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public class DocumentUploadDTO {
    @NotNull
    private Integer caseId;

    @NotNull
    @FileConstraints // Custom validation annotation for file size/type
    private MultipartFile file;

    public DocumentUploadDTO() {
    }

    public DocumentUploadDTO(Integer caseId, MultipartFile file) {
        this.caseId = caseId;
        this.file = file;
    }

    public @NotNull Integer getCaseId() {
        return caseId;
    }

    public void setCaseId(@NotNull Integer caseId) {
        this.caseId = caseId;
    }

    public @NotNull MultipartFile getFile() {
        return file;
    }

    public void setFile(@NotNull MultipartFile file) {
        this.file = file;
    }
}
