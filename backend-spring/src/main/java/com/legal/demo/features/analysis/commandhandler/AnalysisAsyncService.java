package com.legal.demo.features.analysis.commandhandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.domain.fastapi.AIModelClient;
import com.legal.demo.domain.legalcase.Document;
import com.legal.demo.features.chatbot.events.EmbedNotificationEventObject;
import com.legal.demo.features.documentupload.DocumentRepository;
import com.legal.demo.features.documentupload.commandhandler.FileStorageService;
import com.legal.demo.features.analysis.AsyncAnalysisService;
import com.legal.demo.features.analysis.DocumentAnalysisRepository;

import com.legal.demo.features.analysis.InMemoryMultipartFile;
import com.legal.demo.features.analysis.models.DocumentAnalysis;
import com.legal.demo.features.analysis.models.ProcessingStats;
import com.legal.demo.features.analysis.models1.ComprehensiveAnalysis;
import com.legal.demo.features.analysis.models1.Risk;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnalysisAsyncService implements AsyncAnalysisService {
    private static final Logger log = LoggerFactory.getLogger(AnalysisAsyncService.class);

    private final DocumentRepository documentRepo;
    private final AIModelClient aiClient;
    private final ApplicationEventPublisher eventPublisher;
    private final DocumentAnalysisRepository documentAnalysisRepository;
    private final FileStorageService fileStorageService;

    public AnalysisAsyncService(DocumentRepository documentRepo,
                                AIModelClient aiClient, ApplicationEventPublisher eventPublisher,
                                DocumentAnalysisRepository documentAnalysisRepository, FileStorageService fileStorageService) {
        this.documentRepo = documentRepo;
        this.aiClient = aiClient;
        this.eventPublisher = eventPublisher;
        this.documentAnalysisRepository = documentAnalysisRepository;
        this.fileStorageService = fileStorageService;
    }

    @Async
    @Override
    public CompletableFuture<Void> generateSummaryAsync(Integer docId) {
        try {
            log.info("Starting async processing for document ID: {}", docId);

            Document doc = documentRepo.findById(docId)
                    .orElseThrow(() -> new ResourceNotFoundException("Document not found"));


            // Load file from stored path using your FileStorageService
            Resource fileResource = fileStorageService.loadFileAsResource(doc.getFilePath());

            // Create MultipartFile from stored file
            MultipartFile multipartFile = createMultipartFileFromResource(
                    fileResource,
                    doc.getFileName(),
                    doc.getFileType()
            );

            // Generate comprehensive analysis
            log.info("Starting comprehensive analysis for document: {}", doc.getFileName());
            ComprehensiveAnalysis analysis = aiClient.sendForAnalysis(multipartFile);

            // Log analysis results
            logAnalysisResults(analysis, doc.getFileName());


            // Save analysis results to database
            saveAnalysisResults(doc, analysis);
            log.error("Error saving analysis results...");


            // Update document with summary and analysis metadata
            updateDocumentWithResults(doc, analysis.getSummary(), analysis);

            //Publish event to start embedding document
            eventPublisher.publishEvent(new EmbedNotificationEventObject("Done", doc));

            return CompletableFuture.completedFuture(null);

        } catch (Exception ex) {
            log.error("Async summary generation failed for document {}", docId, ex);
            // You might want to update document status to indicate failure
            updateDocumentProcessingStatus(docId, "FAILED", ex.getMessage());
            return CompletableFuture.failedFuture(ex);
        }
    }

    private MultipartFile createMultipartFileFromResource(Resource resource, String originalFilename, String contentType) {
        try {
            byte[] content = resource.getInputStream().readAllBytes();
            return new InMemoryMultipartFile(content, originalFilename, contentType);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file content", e);
        }
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

    @Transactional
    protected void saveAnalysisResults(Document doc, ComprehensiveAnalysis analysis) {
        try {
            // Create and save DocumentAnalysis entity
            DocumentAnalysis documentAnalysis = new DocumentAnalysis();
            documentAnalysis.setDocument(doc);
            documentAnalysis.setSummary(analysis.getSummary());
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
//    public CompletableFuture<Void> reprocessDocument(Integer docId) {
//        log.info("Reprocessing document: {}", docId);
//        return generateSummaryAsync(docId);
//    }

    // Method to get processing statistics
    public ProcessingStats getProcessingStats() {
        // Implementation depends on your requirements
        // Could return counts of processed, failed, pending documents
        return new ProcessingStats();
    }
}