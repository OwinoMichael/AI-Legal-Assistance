package com.legal.demo.features.chatbot;

import com.legal.demo.features.chatbot.models.DocumentEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentEmbeddingRepository extends JpaRepository<DocumentEmbedding, Long> {
}
