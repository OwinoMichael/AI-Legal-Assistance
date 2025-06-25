package com.legal.demo.features.summary;

import com.legal.demo.Command;
import com.legal.demo.features.summary.models.SummaryResponse;

public interface SummaryCommand extends Command<Integer, SummaryResponse> {
    // Synchronous operations only
}
