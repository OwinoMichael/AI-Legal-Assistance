package com.legal.demo.features.analysis;

import com.legal.demo.features.analysis.models.SummaryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/summary")
public class SummaryController {
    private final SummaryCommand summaryCommand;
    private final AsyncAnalysisService asyncAnalysisService;

    public SummaryController(SummaryCommand summaryCommand,
                             AsyncAnalysisService asyncAnalysisService) {
        this.summaryCommand = summaryCommand;
        this.asyncAnalysisService = asyncAnalysisService;
    }

    @PostMapping("/sync/{documentId}")
    public ResponseEntity<SummaryResponse> summarizeDocumentSync(
            @PathVariable Integer documentId) throws Exception {
        return summaryCommand.execute(documentId);
    }

//    @PostMapping("/async/{documentId}")
//    public ResponseEntity<Void> summarizeDocumentAsync(
//            @PathVariable Integer documentId) {
//        asyncSummaryService.generateSummaryAsync(documentId);
//        return ResponseEntity.accepted().build();
//    }
}


