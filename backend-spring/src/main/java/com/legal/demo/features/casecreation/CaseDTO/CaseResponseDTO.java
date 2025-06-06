package com.legal.demo.features.casecreation.CaseDTO;

import java.time.LocalDate;
import java.util.UUID;

public class CaseResponseDTO {
    private Integer id;
    private String title;
    private String description;
    private Integer documents;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private String userId;

    public CaseResponseDTO() {
    }

    public CaseResponseDTO(Integer id, String title, String description, Integer documents, LocalDate createdAt, LocalDate updatedAt, String userId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.documents = documents;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getDocuments() {
        return documents;
    }

    public void setDocuments(Integer documents) {
        this.documents = documents;
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }
}
