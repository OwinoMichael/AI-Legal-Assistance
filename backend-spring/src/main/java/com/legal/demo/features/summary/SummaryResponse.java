package com.legal.demo.features.summary;

import com.legal.demo.domain.legalcase.Document;
import jakarta.persistence.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "summary_response")
public class SummaryResponse {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "document_id")
    private Document document;

    @Lob
    private String summaryText;

    @ElementCollection
    private List<String> extractedClauses;

    @ElementCollection
    private Map<String, String> questionAnswers;

    private LocalDateTime analyzedAt;

    private boolean isUpToDate;

    public SummaryResponse() {
    }

    public SummaryResponse(String summaryText) {
        this.id = id;
        this.document = document;
        this.summaryText = summaryText;
        this.extractedClauses = extractedClauses;
        this.questionAnswers = questionAnswers;
        this.analyzedAt = analyzedAt;
        this.isUpToDate = isUpToDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public String getSummaryText() {
        return summaryText;
    }

    public void setSummaryText(String summaryText) {
        this.summaryText = summaryText;
    }

    public List<String> getExtractedClauses() {
        return extractedClauses;
    }

    public void setExtractedClauses(List<String> extractedClauses) {
        this.extractedClauses = extractedClauses;
    }

    public Map<String, String> getQuestionAnswers() {
        return questionAnswers;
    }

    public void setQuestionAnswers(Map<String, String> questionAnswers) {
        this.questionAnswers = questionAnswers;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(LocalDateTime analyzedAt) {
        this.analyzedAt = analyzedAt;
    }

    public boolean isUpToDate() {
        return isUpToDate;
    }

    public void setUpToDate(boolean upToDate) {
        isUpToDate = upToDate;
    }


}
