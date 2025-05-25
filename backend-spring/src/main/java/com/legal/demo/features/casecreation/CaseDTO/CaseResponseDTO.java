package com.legal.demo.features.casecreation.CaseDTO;

import java.time.LocalDate;
import java.util.UUID;

public class CaseResponseDTO {
    private Integer id;
    private String title;
    private String description;
    private LocalDate createdAt;
    private String userId;

    public CaseResponseDTO() {
    }

    public CaseResponseDTO(Integer id, String title, String description, LocalDate createdAt, String userId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
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
}
