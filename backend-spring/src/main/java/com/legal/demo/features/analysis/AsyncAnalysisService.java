package com.legal.demo.features.analysis;

import java.util.concurrent.CompletableFuture;

public interface AsyncAnalysisService {
    CompletableFuture<Void> generateSummaryAsync(Integer docId);
}