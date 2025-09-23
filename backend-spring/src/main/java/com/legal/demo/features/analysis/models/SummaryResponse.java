package com.legal.demo.features.analysis.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SummaryResponse {
    @JsonProperty("summary")
    private String summary;

    public SummaryResponse() {}

    public SummaryResponse(String summary) {
        this.summary = summary;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}