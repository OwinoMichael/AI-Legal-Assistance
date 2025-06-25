package com.legal.demo.features.summary.commandhandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.domain.legalcase.Document;
import com.legal.demo.features.documentupload.DocumentRepository;
import com.legal.demo.features.summary.AsyncSummaryService;
import com.legal.demo.features.summary.DocumentAnalysisRepository;
import com.legal.demo.features.summary.DocumentEmbeddingRepository;
import com.legal.demo.features.summary.models.DocumentAnalysis;
import com.legal.demo.features.summary.models.DocumentEmbedding;
import com.legal.demo.features.summary.models.ProcessingStats;
import com.legal.demo.features.summary.models.SummaryResponse;
import com.legal.demo.features.summary.models1.ComprehensiveAnalysis;
import com.legal.demo.features.summary.models1.Risk;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Transactional
public class SummaryAsyncService implements AsyncSummaryService {
    private static final Logger log = LoggerFactory.getLogger(SummaryAsyncService.class);

    private final DocumentRepository documentRepo;
    private final AIModelClient aiClient;
    private final SummarySyncService syncService;
    private final DocumentEmbeddingRepository documentEmbeddingRepository;
    private final DocumentAnalysisRepository documentAnalysisRepository; // Add this repository

    public SummaryAsyncService(DocumentRepository documentRepo,
                               AIModelClient aiClient,
                               SummarySyncService syncService,
                               DocumentEmbeddingRepository documentEmbeddingRepository,
                               DocumentAnalysisRepository documentAnalysisRepository) {
        this.documentRepo = documentRepo;
        this.aiClient = aiClient;
        this.syncService = syncService;
        this.documentEmbeddingRepository = documentEmbeddingRepository;
        this.documentAnalysisRepository = documentAnalysisRepository;
    }

    @Async
    @Override
    public CompletableFuture<Void> generateSummaryAsync(Integer docId) {
        try {
            log.info("Starting async processing for document ID: {}", docId);

            Document doc = documentRepo.findById(docId)
                    .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

            String extractedText = syncService.extractTextFromFile(doc.getFilePath());
            String cleanText = syncService.preprocessText(extractedText);

            log.info("Extracted text length: {} characters for document: {}",
                    cleanText.length(), doc.getFileName());

            // Log a sample of the clean text for debugging
            if (cleanText.length() > 100) {
                log.debug("Text sample: {}", cleanText.substring(0, 100) + "...");
            } else {
                log.debug("Full text: {}", cleanText);
            }

            // Check if text is meaningful for analysis
            if (cleanText.trim().length() < 50) {
                log.warn("Document text too short for meaningful analysis: {} characters", cleanText.length());
            }

            // Generate embedding
            log.info("Generating embedding for document: {}", doc.getFileName());
            float[] embedding = aiClient.getEmbeddingForPgVector(cleanText);

            // Save embedding
            DocumentEmbedding documentEmbedding = new DocumentEmbedding();
            documentEmbedding.setEmbedding(embedding);
            documentEmbedding.setDocument(doc);
            documentEmbeddingRepository.save(documentEmbedding);
            log.info("Saved embedding for document: {}", doc.getFileName());

            // Determine document type based on content or filename
            String documentType = determineDocumentType(cleanText, doc.getFileName());
            log.info("Determined document type: {} for document: {}", documentType, doc.getFileName());

            // Generate comprehensive analysis
            log.info("Starting comprehensive analysis for document: {}", doc.getFileName());
            ComprehensiveAnalysis analysis = aiClient.sendForAnalysis(cleanText, documentType);

            // Log analysis results
            logAnalysisResults(analysis, doc.getFileName());

            // Generate summary
            log.info("Generating summary for document: {}", doc.getFileName());
            SummaryResponse summaryResponse = aiClient.sendForSummary(cleanText);

            log.info("Generated summary length: {} for document: {}",
                    summaryResponse.getSummary().length(), doc.getFileName());

            // Save analysis results to database
            saveAnalysisResults(doc, analysis, summaryResponse);

            // Update document with summary and analysis metadata
            updateDocumentWithResults(doc, summaryResponse.getSummary(), analysis);

            log.info("Successfully completed async processing for document: {}", doc.getFileName());
            return CompletableFuture.completedFuture(null);

        } catch (Exception ex) {
            log.error("Async summary generation failed for document {}", docId, ex);
            // You might want to update document status to indicate failure
            updateDocumentProcessingStatus(docId, "FAILED", ex.getMessage());
            return CompletableFuture.failedFuture(ex);
        }
    }

    private String determineDocumentType(String content, String filename) {
        String contentLower = content.toLowerCase();
        String filenameLower = filename.toLowerCase();

        // Check content for keywords
        if (contentLower.contains("employment") || contentLower.contains("job") ||
                contentLower.contains("salary") || contentLower.contains("employee")) {
            return "employment";
        }

        if (contentLower.contains("lease") || contentLower.contains("rent") ||
                contentLower.contains("tenant") || contentLower.contains("landlord")) {
            return "lease";
        }

        if (contentLower.contains("service") || contentLower.contains("client") ||
                contentLower.contains("provider")) {
            return "service";
        }

        if (contentLower.contains("purchase") || contentLower.contains("sale") ||
                contentLower.contains("buyer") || contentLower.contains("seller")) {
            return "purchase";
        }

        if (contentLower.contains("loan") || contentLower.contains("credit") ||
                contentLower.contains("financial") || contentLower.contains("bank")) {
            return "financial";
        }

        // Check filename for clues
        if (filenameLower.contains("contract") || filenameLower.contains("agreement")) {
            return "contract";
        }

        if (filenameLower.contains("invoice") || filenameLower.contains("bill") ||
                filenameLower.contains("receipt")) {
            return "financial";
        }

        return "general";
    }

    private void logAnalysisResults(ComprehensiveAnalysis analysis, String filename) {
        log.info("Analysis results for {}: Risks={}, Clauses={}, KeyTerms={}, ActionItems={}, FinancialItems={}, Confidence={}",
                filename,
                analysis.getRisks() != null ? analysis.getRisks().size() : 0,
                analysis.getClauses() != null ? analysis.getClauses().size() : 0,
                analysis.getKeyTerms() != null ? analysis.getKeyTerms().size() : 0,
                analysis.getActionItems() != null ? analysis.getActionItems().size() : 0,
                analysis.getFinancialImpact() != null ? analysis.getFinancialImpact().size() : 0,
                analysis.getConfidenceScore());

        // Log some details if analysis found items
        if (analysis.getRisks() != null && !analysis.getRisks().isEmpty()) {
            log.info("High-level risks found: {}",
                    analysis.getRisks().stream()
                            .filter(r -> "high".equals(r.getLevel()))
                            .map(Risk::getTitle)
                            .collect(Collectors.toList()));
        }

        if (analysis.getFinancialImpact() != null && !analysis.getFinancialImpact().isEmpty()) {
            log.info("Financial items found: {}",
                    analysis.getFinancialImpact().stream()
                            .map(f -> f.getType() + ": " + f.getAmount())
                            .collect(Collectors.toList()));
        }
    }

    private void saveAnalysisResults(Document doc, ComprehensiveAnalysis analysis, SummaryResponse summary) {
        try {
            // Create and save DocumentAnalysis entity
            DocumentAnalysis documentAnalysis = new DocumentAnalysis();
            documentAnalysis.setDocument(doc);
            documentAnalysis.setSummary(summary.getSummary());
            documentAnalysis.setConfidenceScore(analysis.getConfidenceScore());
            documentAnalysis.setRiskCount(analysis.getRisks() != null ? analysis.getRisks().size() : 0);
            documentAnalysis.setClauseCount(analysis.getClauses() != null ? analysis.getClauses().size() : 0);
            documentAnalysis.setKeyTermCount(analysis.getKeyTerms() != null ? analysis.getKeyTerms().size() : 0);
            documentAnalysis.setActionItemCount(analysis.getActionItems() != null ? analysis.getActionItems().size() : 0);
            documentAnalysis.setFinancialItemCount(analysis.getFinancialImpact() != null ? analysis.getFinancialImpact().size() : 0);
            documentAnalysis.setAnalysisDate(LocalDateTime.now());

            // Convert complex objects to JSON for storage
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                documentAnalysis.setRisksJson(objectMapper.writeValueAsString(analysis.getRisks()));
                documentAnalysis.setClausesJson(objectMapper.writeValueAsString(analysis.getClauses()));
                documentAnalysis.setKeyTermsJson(objectMapper.writeValueAsString(analysis.getKeyTerms()));
                documentAnalysis.setActionItemsJson(objectMapper.writeValueAsString(analysis.getActionItems()));
                documentAnalysis.setFinancialImpactJson(objectMapper.writeValueAsString(analysis.getFinancialImpact()));
                documentAnalysis.setRecommendationsJson(objectMapper.writeValueAsString(analysis.getRecommendations()));
            } catch (JsonProcessingException e) {
                log.error("Error serializing analysis data to JSON", e);
                // Continue without JSON data rather than failing completely
            }

            documentAnalysisRepository.save(documentAnalysis);
            log.info("Saved analysis results for document: {}", doc.getFileName());

        } catch (Exception e) {
            log.error("Error saving analysis results for document: {}", doc.getFileName(), e);
            // Don't rethrow - we want the main process to continue even if analysis saving fails
        }
    }

    private void updateDocumentWithResults(Document doc, String summary, ComprehensiveAnalysis analysis) {
        try {
            doc.setSummary(summary);
            doc.setSummaryGeneratedAt(LocalDateTime.now());
            doc.setProcessingStatus("COMPLETED");

            // Add analysis metadata to document if you have these fields
            if (hasAnalysisFields(doc)) {
                doc.setAnalysisConfidence(analysis.getConfidenceScore());
                doc.setRiskLevel(determineOverallRiskLevel(analysis.getRisks()));
            }

            documentRepo.save(doc);
            log.info("Updated document with summary and analysis metadata: {}", doc.getFileName());

        } catch (Exception e) {
            log.error("Error updating document with results: {}", doc.getFileName(), e);
            throw e; // Rethrow this one as it's critical
        }
    }

    private String determineOverallRiskLevel(List<Risk> risks) {
        if (risks == null || risks.isEmpty()) {
            return "LOW";
        }

        boolean hasHigh = risks.stream().anyMatch(r -> "high".equals(r.getLevel()));
        if (hasHigh) return "HIGH";

        boolean hasMedium = risks.stream().anyMatch(r -> "medium".equals(r.getLevel()));
        if (hasMedium) return "MEDIUM";

        return "LOW";
    }

    private boolean hasAnalysisFields(Document doc) {
        // Check if your Document entity has analysis-related fields
        try {
            doc.getClass().getDeclaredField("analysisConfidence");
            doc.getClass().getDeclaredField("riskLevel");
            return true;
        } catch (NoSuchFieldException e) {
            return false;
        }
    }

    private void updateDocumentProcessingStatus(Integer docId, String status, String errorMessage) {
        try {
            documentRepo.findById(docId).ifPresent(doc -> {
                doc.setProcessingStatus(status);
                if (errorMessage != null) {
                    doc.setProcessingError(errorMessage.substring(0, Math.min(500, errorMessage.length())));
                }
                documentRepo.save(doc);
            });
        } catch (Exception e) {
            log.error("Error updating document processing status", e);
        }
    }

    // Method to reprocess failed documents
    public CompletableFuture<Void> reprocessDocument(Integer docId) {
        log.info("Reprocessing document: {}", docId);
        return generateSummaryAsync(docId);
    }

    // Method to get processing statistics
    public ProcessingStats getProcessingStats() {
        // Implementation depends on your requirements
        // Could return counts of processed, failed, pending documents
        return new ProcessingStats();
    }
}