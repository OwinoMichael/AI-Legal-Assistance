package com.legal.demo.features.summary.models;

import java.util.List;

public class EmbedResponse {

    private List<Float> embedding;

    public EmbedResponse() {
    }

    public EmbedResponse(List<Float> embedding) {
        this.embedding = embedding;
    }

    public List<Float> getEmbedding() {
        return embedding;
    }

    public void setEmbedding(List<Float> embedding) {
        this.embedding = embedding;
    }
}
