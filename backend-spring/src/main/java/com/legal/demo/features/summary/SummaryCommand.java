package com.legal.demo.features.summary;

import com.legal.demo.Command;

public interface SummaryCommand extends Command<Integer, SummaryResponse> {
    // Synchronous operations only
}
