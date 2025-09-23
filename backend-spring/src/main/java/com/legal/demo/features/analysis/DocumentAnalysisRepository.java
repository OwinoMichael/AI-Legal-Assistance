package com.legal.demo.features.analysis;

import com.legal.demo.domain.legalcase.Document;
import com.legal.demo.features.analysis.models.DocumentAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentAnalysisRepository extends JpaRepository<DocumentAnalysis, Long> {
    Optional<DocumentAnalysis> findByDocument(Document document);
    List<DocumentAnalysis> findByDocumentId(Integer documentId);
}