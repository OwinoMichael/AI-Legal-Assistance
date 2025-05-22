package com.legal.demo.features.summary;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import java.io.IOException;

@RestController
@RequestMapping("/summary")
public class SummaryController {
    private final SummaryCommand summaryCommand;
    private final AsyncSummaryService asyncSummaryService;

    public SummaryController(SummaryCommand summaryCommand,
                             AsyncSummaryService asyncSummaryService) {
        this.summaryCommand = summaryCommand;
        this.asyncSummaryService = asyncSummaryService;
    }

    @PostMapping("/sync/{documentId}")
    public ResponseEntity<SummaryResponse> summarizeDocumentSync(
            @PathVariable Integer documentId) throws Exception {
        return summaryCommand.execute(documentId);
    }

    @PostMapping("/async/{documentId}")
    public ResponseEntity<Void> summarizeDocumentAsync(
            @PathVariable Integer documentId) {
        asyncSummaryService.generateSummaryAsync(documentId);
        return ResponseEntity.accepted().build();
    }
}


