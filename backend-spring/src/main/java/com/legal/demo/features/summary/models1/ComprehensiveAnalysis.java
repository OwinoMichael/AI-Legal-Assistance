package com.legal.demo.features.summary.models1;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class ComprehensiveAnalysis {
    @JsonProperty("summary")
    private String summary;

    @JsonProperty("risks")
    private List<Risk> risks;

    @JsonProperty("clauses")
    private List<Clause> clauses;

    @JsonProperty("key_terms")
    private List<KeyTerm> keyTerms;

    @JsonProperty("action_items")
    private List<ActionItem> actionItems;

    @JsonProperty("financial_impact")
    private List<FinancialItem> financialImpact;

    @JsonProperty("recommendations")
    private List<String> recommendations;

    @JsonProperty("compliance_item")
    private List<ComplianceItem> complianceItems;

    @JsonProperty("confidence_score")
    private Double confidenceScore;

    public ComprehensiveAnalysis() {}

    public ComprehensiveAnalysis(String summary, List<Risk> risks, List<Clause> clauses, List<KeyTerm> keyTerms, List<ActionItem> actionItems, List<FinancialItem> financialImpact, List<String> recommendations, List<ComplianceItem> complianceItems, Double confidenceScore) {
        this.summary = summary;
        this.risks = risks;
        this.clauses = clauses;
        this.keyTerms = keyTerms;
        this.actionItems = actionItems;
        this.financialImpact = financialImpact;
        this.recommendations = recommendations;
        this.complianceItems = complianceItems;
        this.confidenceScore = confidenceScore;
    }

    // Getters and Setters
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<Risk> getRisks() { return risks; }
    public void setRisks(List<Risk> risks) { this.risks = risks; }

    public List<Clause> getClauses() { return clauses; }
    public void setClauses(List<Clause> clauses) { this.clauses = clauses; }

    public List<KeyTerm> getKeyTerms() { return keyTerms; }
    public void setKeyTerms(List<KeyTerm> keyTerms) { this.keyTerms = keyTerms; }

    public List<ActionItem> getActionItems() { return actionItems; }
    public void setActionItems(List<ActionItem> actionItems) { this.actionItems = actionItems; }

    public List<FinancialItem> getFinancialImpact() { return financialImpact; }
    public void setFinancialImpact(List<FinancialItem> financialImpact) { this.financialImpact = financialImpact; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public List<ComplianceItem> getComplianceItems() {
        return complianceItems;
    }

    public void setComplianceItems(List<ComplianceItem> complianceItems) {
        this.complianceItems = complianceItems;
    }

    @Override
    public String toString() {
        return "ComprehensiveAnalysis{" +
                "summary='" + summary + '\'' +
                ", risks=" + risks +
                ", clauses=" + clauses +
                ", keyTerms=" + keyTerms +
                ", actionItems=" + actionItems +
                ", financialImpact=" + financialImpact +
                ", recommendations=" + recommendations +
                ", complianceItems=" + complianceItems +
                ", confidenceScore=" + confidenceScore +
                '}';
    }
}
