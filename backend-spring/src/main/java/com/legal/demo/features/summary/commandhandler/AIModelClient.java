package com.legal.demo.features.summary.commandhandler;

import com.legal.demo.features.summary.SummaryResponse;
import com.legal.demo.features.summary.models.EmbedResponse;
import com.legal.demo.features.summary.models.TextRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.List;
import java.util.Map;

@Component
public class AIModelClient {

    private final WebClient webClient;
    private static final Logger log = LoggerFactory.getLogger(AIModelClient.class);

    public AIModelClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://localhost:8000").build(); // MCP Server
    }

    /**
     * Gets embedding and returns it as a float array for pgvector.
     * Example pgvector column: `VECTOR(768)` (adjust dimension as needed).
     */
    public float[] getEmbeddingForPgVector(String text) {
        EmbedResponse response = webClient.post()
                .uri("/embed")
                .bodyValue(new TextRequest(text))  // Use DTO
                .retrieve()
                .bodyToMono(EmbedResponse.class)
                .doOnNext(res -> logEmbedding(res.getEmbedding()))
                .block();

        return convertToFloatArray(response.getEmbedding());
    }

    // Convert List<Float> to float[] for pgvector
    private float[] convertToFloatArray(List<Float> embeddingList) {
        float[] array = new float[embeddingList.size()];
        for (int i = 0; i < embeddingList.size(); i++) {
            array[i] = embeddingList.get(i);
        }
        return array;
    }

    // Log the first 5 elements for debugging
    private void logEmbedding(List<Float> embedding) {
        log.info("Received embedding (first 5 dims): {}... (length: {})",
                embedding.subList(0, Math.min(5, embedding.size())),
                embedding.size());
    }

    public SummaryResponse sendForSummary(String text) {
        return webClient.post()
                .uri("/summarize")
                .bodyValue(Map.of("text", text))
                .retrieve()
                .bodyToMono(SummaryResponse.class)
                .block();
    }
}

