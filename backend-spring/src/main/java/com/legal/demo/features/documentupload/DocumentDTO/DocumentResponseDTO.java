package com.legal.demo.features.documentupload.DocumentDTO;

import java.time.LocalDate;

public class DocumentResponseDTO {

    private Integer id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String filePath;
    private String downloadUrl;
    private LocalDate createdAt;
    private Integer caseId;

    public DocumentResponseDTO() {
    }

    public DocumentResponseDTO(Integer id, String fileName, String fileType, Long fileSize, String filePath, String downloadUrl, LocalDate createdAt, Integer caseId) {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.filePath = filePath;
        this.downloadUrl = downloadUrl;
        this.createdAt = createdAt;
        this.caseId = caseId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getCaseId() {
        return caseId;
    }

    public void setCaseId(Integer caseId) {
        this.caseId = caseId;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
