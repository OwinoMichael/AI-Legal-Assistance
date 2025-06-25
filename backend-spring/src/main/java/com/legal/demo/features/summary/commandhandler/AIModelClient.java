package com.legal.demo.features.summary.commandhandler;

import com.legal.demo.features.summary.models.DocumentAnalysisRequest;
import com.legal.demo.features.summary.models.SummaryResponse;
import com.legal.demo.features.summary.models.EmbedResponse;
import com.legal.demo.features.summary.models.TextRequest;
import com.legal.demo.features.summary.models1.ComprehensiveAnalysis;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;


import java.time.Duration;
import java.util.List;

@Component
public class AIModelClient {

    private final WebClient webClient;
    private static final Logger log = LoggerFactory.getLogger(AIModelClient.class);

    public AIModelClient(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://localhost:8000")
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024)) // 10MB buffer
                .build();
    }

    /**
     * Gets embedding and returns it as a float array for pgvector.
     * Example pgvector column: `VECTOR(768)` (adjust dimension as needed).
     */
    public float[] getEmbeddingForPgVector(String text) {
        try {
            EmbedResponse response = webClient.post()
                    .uri("/embed")
                    .bodyValue(new TextRequest(text))
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .map(body -> new RuntimeException("Embedding API error: " + body)))
                    .bodyToMono(EmbedResponse.class)
                    .timeout(Duration.ofSeconds(30))
                    .retryWhen(Retry.fixedDelay(2, Duration.ofSeconds(2)))
                    .doOnNext(res -> logEmbedding(res.getEmbedding()))
                    .doOnError(error -> log.error("Error getting embedding for text: {}",
                            text.substring(0, Math.min(50, text.length())), error))
                    .block();

            if (response == null || response.getEmbedding() == null) {
                throw new RuntimeException("Received null embedding response");
            }

            return convertToFloatArray(response.getEmbedding());

        } catch (WebClientResponseException e) {
            log.error("WebClient error getting embedding: Status={}, Body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to get embedding: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error getting embedding", e);
            throw new RuntimeException("Failed to get embedding: " + e.getMessage(), e);
        }
    }

    /**
     * Sends text for summarization
     */
    public SummaryResponse sendForSummary(String text) {
        try {
            SummaryResponse response = webClient.post()
                    .uri("/summarize")
                    .bodyValue(new TextRequest(text))
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .map(body -> new RuntimeException("Summary API error: " + body)))
                    .bodyToMono(SummaryResponse.class)
                    .timeout(Duration.ofSeconds(60)) // Longer timeout for summarization
                    .retryWhen(Retry.fixedDelay(2, Duration.ofSeconds(3)))
                    .doOnError(error -> log.error("Error getting summary for text: {}",
                            text.substring(0, Math.min(50, text.length())), error))
                    .block();

            if (response == null) {
                throw new RuntimeException("Received null summary response");
            }

            log.info("Successfully received summary of length: {}",
                    response.getSummary() != null ? response.getSummary().length() : 0);
            return response;

        } catch (WebClientResponseException e) {
            log.error("WebClient error getting summary: Status={}, Body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to get summary: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error getting summary", e);
            throw new RuntimeException("Failed to get summary: " + e.getMessage(), e);
        }
    }

    /**
     * Sends document for comprehensive analysis
     */
    public ComprehensiveAnalysis sendForAnalysis(String text, String documentType) {
        try {
            DocumentAnalysisRequest request = new DocumentAnalysisRequest(text, documentType);

            ComprehensiveAnalysis response = webClient.post()
                    .uri("/analyze")
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .map(body -> new RuntimeException("Analysis API error: " + body)))
                    .bodyToMono(ComprehensiveAnalysis.class)
                    .timeout(Duration.ofMinutes(2)) // Longer timeout for complex analysis
                    .retryWhen(Retry.fixedDelay(2, Duration.ofSeconds(5)))
                    .doOnNext(res -> logAnalysisResults(res))
                    .doOnError(error -> log.error("Error getting analysis for document type '{}', text: {}",
                            documentType, text.substring(0, Math.min(50, text.length())), error))
                    .block();

            if (response == null) {
                throw new RuntimeException("Received null analysis response");
            }

            return response;

        } catch (WebClientResponseException e) {
            log.error("WebClient error getting analysis: Status={}, Body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to get analysis: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error getting analysis", e);
            throw new RuntimeException("Failed to get analysis: " + e.getMessage(), e);
        }
    }

    /**
     * Overloaded method for analysis with default document type
     */
    public ComprehensiveAnalysis sendForAnalysis(String text) {
        return sendForAnalysis(text, "general");
    }

    /**
     * Async version of embedding request (non-blocking)
     */
    public Mono<float[]> getEmbeddingForPgVectorAsync(String text) {
        return webClient.post()
                .uri("/embed")
                .bodyValue(new TextRequest(text))
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Embedding API error: " + body)))
                .bodyToMono(EmbedResponse.class)
                .timeout(Duration.ofSeconds(30))
                .retryWhen(Retry.fixedDelay(2, Duration.ofSeconds(2)))
                .doOnNext(res -> logEmbedding(res.getEmbedding()))
                .doOnError(error -> log.error("Error getting embedding async for text: {}",
                        text.substring(0, Math.min(50, text.length())), error))
                .map(response -> {
                    if (response == null || response.getEmbedding() == null) {
                        throw new RuntimeException("Received null embedding response");
                    }
                    return convertToFloatArray(response.getEmbedding());
                });
    }

    /**
     * Health check for the AI service
     */
    public boolean isServiceHealthy() {
        try {
            String response = webClient.get()
                    .uri("/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            log.debug("Health check response: {}", response);
            return response != null && response.contains("healthy");

        } catch (Exception e) {
            log.warn("Health check failed", e);
            return false;
        }
    }

    // Convert List<Float> to float[] for pgvector
    private float[] convertToFloatArray(List<Float> embeddingList) {
        if (embeddingList == null || embeddingList.isEmpty()) {
            throw new RuntimeException("Embedding list is null or empty");
        }

        float[] array = new float[embeddingList.size()];
        for (int i = 0; i < embeddingList.size(); i++) {
            Float value = embeddingList.get(i);
            if (value == null) {
                throw new RuntimeException("Null value found in embedding at index: " + i);
            }
            array[i] = value;
        }
        return array;
    }

    // Log the first 5 elements for debugging
    private void logEmbedding(List<Float> embedding) {
        if (embedding == null || embedding.isEmpty()) {
            log.warn("Received null or empty embedding");
            return;
        }

        log.info("Received embedding (first 5 dims): {}... (length: {})",
                embedding.subList(0, Math.min(5, embedding.size())),
                embedding.size());
    }

    // Log analysis results summary
    private void logAnalysisResults(ComprehensiveAnalysis analysis) {
        if (analysis == null) {
            log.warn("Received null analysis");
            return;
        }

        log.info("Analysis completed - Risks: {}, Clauses: {}, Key Terms: {}, Action Items: {}, Confidence: {}",
                analysis.getRisks() != null ? analysis.getRisks().size() : 0,
                analysis.getClauses() != null ? analysis.getClauses().size() : 0,
                analysis.getKeyTerms() != null ? analysis.getKeyTerms().size() : 0,
                analysis.getActionItems() != null ? analysis.getActionItems().size() : 0,
                analysis.getConfidenceScore());
    }
}

