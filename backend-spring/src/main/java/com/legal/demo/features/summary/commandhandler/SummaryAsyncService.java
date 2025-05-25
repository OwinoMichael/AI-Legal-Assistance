package com.legal.demo.features.summary.commandhandler;

import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.domain.legalcase.Document;
import com.legal.demo.features.documentupload.DocumentRepository;
import com.legal.demo.features.summary.AsyncSummaryService;
import com.legal.demo.features.summary.SummaryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class SummaryAsyncService implements AsyncSummaryService {
    private static final Logger log = LoggerFactory.getLogger(SummaryAsyncService.class);

    private final DocumentRepository documentRepo;
    private final AIModelClient aiClient;
    private final SummarySyncService syncService; // Reuse sync logic

    public SummaryAsyncService(DocumentRepository documentRepo,
                               AIModelClient aiClient,
                               SummarySyncService syncService) {
        this.documentRepo = documentRepo;
        this.aiClient = aiClient;
        this.syncService = syncService;
    }

    @Async
    @Override
    public CompletableFuture<Void> generateSummaryAsync(Integer docId) {
        try {
            Document doc = documentRepo.findById(docId)
                    .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

            String extractedText = syncService.extractTextFromFile(doc.getFilePath());
            String cleanText = syncService.preprocessText(extractedText);

            SummaryResponse response = aiClient.sendForSummary(cleanText);
            String summary = response.getSummaryText();

            // Uncomment when ready to persist
            // doc.setSummary(summary);
            // doc.setSummaryGeneratedAt(LocalDateTime.now());
            // documentRepo.save(doc);

            return CompletableFuture.completedFuture(null);
        } catch (Exception ex) {
            log.error("Async summary generation failed for document {}", docId, ex);
            return CompletableFuture.failedFuture(ex);
        }
    }
}
