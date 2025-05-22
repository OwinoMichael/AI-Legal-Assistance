package com.legal.demo.features.casecreation.CaseDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public class CaseDTO {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "User ID is required")
    private UUID userId;

    public CaseDTO() {
    }

    public CaseDTO(String title, String description, UUID userId) {
        this.title = title;
        this.description = description;
        this.userId = userId;
    }

    public @NotBlank(message = "Title is required") String getTitle() {
        return title;
    }

    public void setTitle(@NotBlank(message = "Title is required") String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }



    public @NotNull(message = "User ID is required") UUID getUserId() {
        return userId;
    }

    public void setUserId(@NotNull(message = "User ID is required") UUID userId) {
        this.userId = userId;
    }
}


