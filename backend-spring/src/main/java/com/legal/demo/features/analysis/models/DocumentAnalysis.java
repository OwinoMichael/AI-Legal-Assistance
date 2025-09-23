package com.legal.demo.features.analysis.models;

import com.legal.demo.domain.legalcase.Document;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "document_analysis")
public class DocumentAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "document_id")
    private Document document;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "risk_count")
    private Integer riskCount;

    @Column(name = "clause_count")
    private Integer clauseCount;

    @Column(name = "keyterm_count")
    private Integer keyTermCount;

    @Column(name = "action_item_count")
    private Integer actionItemCount;

    @Column(name = "financial_item_count")
    private Integer financialItemCount;

    @Column(columnDefinition = "TEXT")
    private String risksJson;

    @Column(columnDefinition = "TEXT")
    private String clausesJson;

    @Column(columnDefinition = "TEXT")
    private String keyTermsJson;

    @Column(columnDefinition = "TEXT")
    private String actionItemsJson;

    @Column(columnDefinition = "TEXT")
    private String financialImpactJson;

    @Column(columnDefinition = "TEXT")
    private String recommendationsJson;

    private LocalDateTime analysisDate;

    public DocumentAnalysis() {
    }

    public DocumentAnalysis(Long id, Document document, String summary, Double confidenceScore, Integer riskCount, Integer clauseCount, Integer keyTermCount, Integer actionItemCount, Integer financialItemCount, String risksJson, String clausesJson, String keyTermsJson, String actionItemsJson, String financialImpactJson, String recommendationsJson, LocalDateTime analysisDate) {
        this.id = id;
        this.document = document;
        this.summary = summary;
        this.confidenceScore = confidenceScore;
        this.riskCount = riskCount;
        this.clauseCount = clauseCount;
        this.keyTermCount = keyTermCount;
        this.actionItemCount = actionItemCount;
        this.financialItemCount = financialItemCount;
        this.risksJson = risksJson;
        this.clausesJson = clausesJson;
        this.keyTermsJson = keyTermsJson;
        this.actionItemsJson = actionItemsJson;
        this.financialImpactJson = financialImpactJson;
        this.recommendationsJson = recommendationsJson;
        this.analysisDate = analysisDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public Integer getRiskCount() {
        return riskCount;
    }

    public void setRiskCount(Integer riskCount) {
        this.riskCount = riskCount;
    }

    public Integer getClauseCount() {
        return clauseCount;
    }

    public void setClauseCount(Integer clauseCount) {
        this.clauseCount = clauseCount;
    }

    public Integer getKeyTermCount() {
        return keyTermCount;
    }

    public void setKeyTermCount(Integer keyTermCount) {
        this.keyTermCount = keyTermCount;
    }

    public Integer getActionItemCount() {
        return actionItemCount;
    }

    public void setActionItemCount(Integer actionItemCount) {
        this.actionItemCount = actionItemCount;
    }

    public Integer getFinancialItemCount() {
        return financialItemCount;
    }

    public void setFinancialItemCount(Integer financialItemCount) {
        this.financialItemCount = financialItemCount;
    }

    public String getRisksJson() {
        return risksJson;
    }

    public void setRisksJson(String risksJson) {
        this.risksJson = risksJson;
    }

    public String getClausesJson() {
        return clausesJson;
    }

    public void setClausesJson(String clausesJson) {
        this.clausesJson = clausesJson;
    }

    public String getKeyTermsJson() {
        return keyTermsJson;
    }

    public void setKeyTermsJson(String keyTermsJson) {
        this.keyTermsJson = keyTermsJson;
    }

    public String getActionItemsJson() {
        return actionItemsJson;
    }

    public void setActionItemsJson(String actionItemsJson) {
        this.actionItemsJson = actionItemsJson;
    }

    public String getFinancialImpactJson() {
        return financialImpactJson;
    }

    public void setFinancialImpactJson(String financialImpactJson) {
        this.financialImpactJson = financialImpactJson;
    }

    public String getRecommendationsJson() {
        return recommendationsJson;
    }

    public void setRecommendationsJson(String recommendationsJson) {
        this.recommendationsJson = recommendationsJson;
    }

    public LocalDateTime getAnalysisDate() {
        return analysisDate;
    }

    public void setAnalysisDate(LocalDateTime analysisDate) {
        this.analysisDate = analysisDate;
    }
}