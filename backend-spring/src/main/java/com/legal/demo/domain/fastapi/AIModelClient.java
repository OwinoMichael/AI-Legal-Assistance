package com.legal.demo.domain.fastapi;

import com.legal.demo.features.analysis.MultipartFileResource;
import com.legal.demo.features.analysis.models.SummaryResponse;
import com.legal.demo.features.chatbot.models.ChatRequest;
import com.legal.demo.features.chatbot.models.ChatResponse;
import com.legal.demo.features.chatbot.models.EmbedResponse;
import com.legal.demo.features.analysis.models.TextRequest;
import com.legal.demo.features.analysis.models1.ComprehensiveAnalysis;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
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
    public float[] getEmbeddingForPgVector() {
        try {
            EmbedResponse response = webClient.post()
                    .uri("/embed")
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .map(body -> new RuntimeException("Embedding API error: " + body)))
                    .bodyToMono(EmbedResponse.class)
                    .timeout(Duration.ofSeconds(30))
                    .retryWhen(Retry.fixedDelay(2, Duration.ofSeconds(2)))
                    .doOnNext(res -> logEmbedding(res.getEmbedding()))
                    .doOnError(error -> log.error("Error getting embedding for ", error))
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
    public ComprehensiveAnalysis sendForAnalysis(MultipartFile file, String documentType) {
        try {
            // Create multipart form data
            MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();

            // Add file part
            parts.add("file", new MultipartFileResource(file));

            // Add document type as form field
            parts.add("document_type", documentType);

            ComprehensiveAnalysis response = webClient.post()
                    .uri("/analyze")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(parts))
                    .retrieve()
                    .onStatus(
                            status -> status.is4xxClientError() || status.is5xxServerError(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .map(body -> new RuntimeException("Analysis API error: " + body))
                    )
                    .bodyToMono(ComprehensiveAnalysis.class)
                    .timeout(Duration.ofMinutes(5)) // Increased timeout
                    .retryWhen(Retry.fixedDelay(2, Duration.ofSeconds(10))) // Increased retry delay
                    .doOnNext(this::logAnalysisResults)
                    .doOnError(error -> log.error(
                            "Error during analysis for document type '{}', file '{}': {}",
                            documentType,
                            file.getOriginalFilename(),
                            error.getMessage(),
                            error
                    ))
                    .block();

            if (response == null) {
                throw new RuntimeException("Received null analysis response");
            }

            return response;

        } catch (WebClientResponseException e) {
            log.error("WebClient error getting analysis: Status={}, Body={}",
                    e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to get analysis: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error getting analysis", e);
            throw new RuntimeException("Failed to get analysis: " + e.getMessage(), e);
        }
    }

    public ComprehensiveAnalysis sendForAnalysis(MultipartFile file) {
        return sendForAnalysis(file, "general");
    }

    public Flux<String> sendToChatLLM(String text){
        try {
            return webClient
                    .post()
                    .uri("/chat")
                    .bodyValue(new ChatRequest(text))
                    .retrieve()
                    .bodyToFlux(String.class) // Use bodyToFlux instead of bodyToMono
                    .doOnError(error -> log.error("Error in streaming response", error));

        } catch (WebClientResponseException e) {
            log.error("WebClient error getting chat: Status={}, Body={}",
                    e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to get analysis: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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

        log.info("Analysis completed - Risks: {}, Clauses: {}, Key Terms: {}, Action Items: {}, Compliance: {}, Confidence: {}, Financial: {}, Recommendation: {}, ",
                analysis.getRisks() != null ? analysis.getRisks().size() : 0,
                analysis.getClauses() != null ? analysis.getClauses().size() : 0,
                analysis.getKeyTerms() != null ? analysis.getKeyTerms().size() : 0,
                analysis.getActionItems() != null ? analysis.getActionItems().size() : 0,
                analysis.getComplianceItems() != null ? analysis.getComplianceItems().size() : 0,
                analysis.getConfidenceScore() != null ? analysis.getConfidenceScore() : 0,
                analysis.getFinancialImpact() != null ? analysis.getFinancialImpact() : 0,
                analysis.getRecommendations() != null ? analysis.getRecommendations() : 0,
                analysis.getConfidenceScore());
    }
}

