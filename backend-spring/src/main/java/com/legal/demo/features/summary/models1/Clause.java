package com.legal.demo.features.summary.models1;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Clause {
    @JsonProperty("type")
    private String type;

    @JsonProperty("title")
    private String title;

    @JsonProperty("content")
    private String content;

    @JsonProperty("significance")
    private String significance;

    @JsonProperty("location")
    private Integer location;

    public Clause() {}

    public Clause(String type, String title, String content, String significance, Integer location) {
        this.type = type;
        this.title = title;
        this.content = content;
        this.significance = significance;
        this.location = location;
    }

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSignificance() { return significance; }
    public void setSignificance(String significance) { this.significance = significance; }

    public Integer getLocation() { return location; }
    public void setLocation(Integer location) { this.location = location; }

    @Override
    public String toString() {
        return "Clause{" +
                "type='" + type + '\'' +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", significance='" + significance + '\'' +
                ", location=" + location +
                '}';
    }
}
