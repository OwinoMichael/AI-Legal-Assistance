package com.legal.demo.features.analysis;

import com.legal.demo.Command;
import com.legal.demo.features.analysis.models.SummaryResponse;

public interface SummaryCommand extends Command<Integer, SummaryResponse> {
    // Synchronous operations only
}
