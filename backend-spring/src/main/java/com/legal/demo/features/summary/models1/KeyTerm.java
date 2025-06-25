package com.legal.demo.features.summary.models1;

import com.fasterxml.jackson.annotation.JsonProperty;

public class KeyTerm {
    @JsonProperty("term")
    private String term;

    @JsonProperty("definition")
    private String definition;

    @JsonProperty("category")
    private String category;

    @JsonProperty("context")
    private String context;

    public KeyTerm() {}

    public KeyTerm(String term, String definition, String category, String context) {
        this.term = term;
        this.definition = definition;
        this.category = category;
        this.context = context;
    }

    // Getters and Setters
    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }

    public String getDefinition() { return definition; }
    public void setDefinition(String definition) { this.definition = definition; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }

    @Override
    public String toString() {
        return "KeyTerm{" +
                "term='" + term + '\'' +
                ", definition='" + definition + '\'' +
                ", category='" + category + '\'' +
                ", context='" + context + '\'' +
                '}';
    }
}
