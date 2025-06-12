package com.legal.demo.features.summary.commandhandler;

import com.legal.demo.application.exceptions.ResourceNotFoundException;
import com.legal.demo.domain.legalcase.Document;
import com.legal.demo.features.documentupload.DocumentRepository;
import com.legal.demo.features.summary.SummaryCommand;
import com.legal.demo.features.summary.SummaryResponse;
import jakarta.annotation.PostConstruct;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@Transactional
public class SummarySyncService implements SummaryCommand {
    private static final Logger log = LoggerFactory.getLogger(SummarySyncService.class);

    private final DocumentRepository documentRepo;
    private final AIModelClient aiClient;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        // Convert to absolute path once during initialization
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    private Path uploadPath;

    public SummarySyncService(DocumentRepository documentRepo, AIModelClient aiClient) {
        this.documentRepo = documentRepo;
        this.aiClient = aiClient;
    }

    @Override
    public ResponseEntity<SummaryResponse> execute(Integer docId) throws IOException, SAXException, TikaException {
        Document doc = documentRepo.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        String extractedText = extractTextFromFile(doc.getFilePath());
        String cleanText = preprocessText(extractedText);

        SummaryResponse response = aiClient.sendForSummary(cleanText);
        return ResponseEntity.ok(new SummaryResponse(response.getSummaryText()));
    }

    // Shared helper methods
    String extractTextFromFile(String filePath) throws IOException, TikaException, SAXException {
        Path path = uploadPath.resolve(filePath);
        if (!Files.exists(path)) {
            throw new IOException("File not found at path: " + filePath);
        }

        try (InputStream stream = Files.newInputStream(path)) {
            ContentHandler handler = new BodyContentHandler(-1);
            Metadata metadata = new Metadata();
            new AutoDetectParser().parse(stream, handler, metadata, new ParseContext());
            return handler.toString();
        }
    }

    String preprocessText(String rawText) {
        return rawText.replaceAll("(?m)^\\s*Page \\d+.*$", "")
                .replaceAll("(?m)^\\s*CONFIDENTIAL.*$", "")
                .replaceAll("\\s{2,}", " ")
                .trim();
    }
}