package com.legal.demo.features.chatbot.events;

import com.legal.demo.domain.legalcase.Document;
import com.legal.demo.domain.fastapi.AIModelClient;
import com.legal.demo.features.chatbot.DocumentEmbeddingRepository;
import com.legal.demo.features.chatbot.models.DocumentEmbedding;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class EmbedDocumentService {

    private static final Logger log = LoggerFactory.getLogger(EmbedDocumentService.class);

    private final DocumentEmbeddingRepository documentEmbeddingRepository;
    private final AIModelClient aiModelClient;


    public EmbedDocumentService(DocumentEmbeddingRepository documentEmbeddingRepository, AIModelClient aiModelClient) {
        this.documentEmbeddingRepository = documentEmbeddingRepository;
        this.aiModelClient = aiModelClient;
    }

    @Async
    @EventListener
    public void handleDocumentEmbedding(EmbedNotificationEventObject embedNotificationEventObject){

        Document doc = embedNotificationEventObject.getDocument();


        // Generate embedding
        log.info("Generating embedding for document: {}", doc.getFileName());
        float[] embedding = aiModelClient.getEmbeddingForPgVector();

        // Save embedding
        DocumentEmbedding documentEmbedding = new DocumentEmbedding();
        documentEmbedding.setEmbedding(embedding);
        documentEmbedding.setDocument(doc);

        documentEmbeddingRepository.save(documentEmbedding);
        log.info("Saved embedding for document: {}", doc.getFileName());

        log.info("Successfully completed async processing for document: {}", doc.getFileName());
    }
}
