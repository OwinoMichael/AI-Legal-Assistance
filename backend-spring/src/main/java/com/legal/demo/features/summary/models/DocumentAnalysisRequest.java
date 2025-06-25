package com.legal.demo.features.summary.models;

public class DocumentAnalysisRequest {
    private String text;
    private String documentType;

    public DocumentAnalysisRequest() {}

    public DocumentAnalysisRequest(String text, String documentType) {
        this.text = text;
        this.documentType = documentType;
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
}
