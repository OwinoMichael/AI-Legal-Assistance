package com.legal.demo.domain.legalcase;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "document")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Size(min = 2, max = 50, message = "File name must be between 2-50 characters")
    @NotBlank(message = "File name required")
    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_path")
    @NotBlank(message = "File path required")
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @ManyToOne
    @JoinColumn(name = "legal_case_id", referencedColumnName = "id")
    private Case legalCase;

    public Document() {
    }

    public Document(Integer id, String fileName, String filePath, LocalDate createdAt, LocalDate updatedAt, Case legalCase) {
        this.id = id;
        this.fileName = fileName;
        this.filePath = filePath;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.legalCase = legalCase;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Case getLegalCase() {
        return legalCase;
    }

    public void setLegalCase(Case legalCase) {
        this.legalCase = legalCase;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Document document = (Document) o;
        return Objects.equals(id, document.id) && Objects.equals(fileName, document.fileName) && Objects.equals(createdAt, document.createdAt) && Objects.equals(updatedAt, document.updatedAt) && Objects.equals(legalCase, document.legalCase);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fileName, createdAt, updatedAt, legalCase);
    }

    @Override
    public String toString() {
        return "Document{" +
                "id=" + id +
                ", fileName='" + fileName + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", legalCase=" + legalCase +
                '}';
    }
}
