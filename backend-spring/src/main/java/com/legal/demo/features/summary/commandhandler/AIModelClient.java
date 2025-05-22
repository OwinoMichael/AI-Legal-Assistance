package com.legal.demo.features.summary.commandhandler;

import com.legal.demo.features.summary.SummaryResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.Map;

@Component
public class AIModelClient {

    private final WebClient webClient;

    public AIModelClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://localhost:8000").build(); // MCP Server
    }

    public SummaryResponse sendForSummary(String text) {
        return webClient.post()
                .uri("/summarize")
                .bodyValue(Map.of("text", text))
                .retrieve()
                .bodyToMono(SummaryResponse.class)
                .block();
    }
}

