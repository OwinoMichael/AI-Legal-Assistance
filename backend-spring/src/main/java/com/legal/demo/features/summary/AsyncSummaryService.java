package com.legal.demo.features.summary;

import java.util.concurrent.CompletableFuture;

public interface AsyncSummaryService {
    CompletableFuture<Void> generateSummaryAsync(Integer docId);
}