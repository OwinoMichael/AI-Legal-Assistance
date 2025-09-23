package com.legal.demo.features.analysis.models;

public class ProcessingStats {
    private long totalProcessed;
    private long successfullyProcessed;
    private long failedProcessing;
    private long pendingProcessing;

    public ProcessingStats() {
    }

    public ProcessingStats(long totalProcessed, long successfullyProcessed, long failedProcessing, long pendingProcessing) {
        this.totalProcessed = totalProcessed;
        this.successfullyProcessed = successfullyProcessed;
        this.failedProcessing = failedProcessing;
        this.pendingProcessing = pendingProcessing;
    }

    public long getTotalProcessed() {
        return totalProcessed;
    }

    public void setTotalProcessed(long totalProcessed) {
        this.totalProcessed = totalProcessed;
    }

    public long getSuccessfullyProcessed() {
        return successfullyProcessed;
    }

    public void setSuccessfullyProcessed(long successfullyProcessed) {
        this.successfullyProcessed = successfullyProcessed;
    }

    public long getFailedProcessing() {
        return failedProcessing;
    }

    public void setFailedProcessing(long failedProcessing) {
        this.failedProcessing = failedProcessing;
    }

    public long getPendingProcessing() {
        return pendingProcessing;
    }

    public void setPendingProcessing(long pendingProcessing) {
        this.pendingProcessing = pendingProcessing;
    }
}
