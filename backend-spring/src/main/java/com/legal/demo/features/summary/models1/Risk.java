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

    public Risk() {}

    public Risk(String level, String title, String description, Double confidence) {
        this.level = level;
        this.title = title;
        this.description = description;
        this.confidence = confidence;
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

    @Override
    public String toString() {
        return "Risk{" +
                "level='" + level + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", confidence=" + confidence +
                '}';
    }
}
