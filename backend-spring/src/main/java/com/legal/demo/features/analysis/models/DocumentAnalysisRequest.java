package com.legal.demo.features.analysis.models;

import org.springframework.web.multipart.MultipartFile;

public class DocumentAnalysisRequest {
    private MultipartFile file;
    private String documentType;

    public DocumentAnalysisRequest() {}

    public DocumentAnalysisRequest(MultipartFile file, String documentType) {
        this.file = file;
        this.documentType = documentType;
    }

    public MultipartFile getFile() { return file; }
    public void setFile(MultipartFile file) { this.file = file; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
}
