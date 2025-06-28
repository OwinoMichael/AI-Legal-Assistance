package com.legal.demo.features.summary.models1;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Risk {
    @JsonProperty("level")
    private String level;

    @JsonProperty("title")
    private String title;

    @JsonProperty("description")
    private String description;

    @JsonProperty("confidence")
    private Double confidence;

    @JsonProperty("category")
    private String category;

    @JsonProperty("severity_score")
    private Double severity_score;

    public Risk() {}

    public Risk(String level, String title, String description, Double confidence, String category, Double severity_score) {
        this.level = level;
        this.title = title;
        this.description = description;
        this.confidence = confidence;
        this.category = category;
        this.severity_score = severity_score;
    }

    // Getters and Setters
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getSeverity_score() {
        return severity_score;
    }

    public void setSeverity_score(Double severity_score) {
        this.severity_score = severity_score;
    }

    @Override
    public String toString() {
        return "Risk{" +
                "level='" + level + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", confidence=" + confidence +
                ", category='" + category + '\'' +
                ", severity_score=" + severity_score +
                '}';
    }
}
