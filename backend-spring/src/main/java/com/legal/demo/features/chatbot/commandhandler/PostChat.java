package com.legal.demo.features.chatbot.commandhandler;

import com.legal.demo.Command;
import com.legal.demo.domain.fastapi.AIModelClient;
import com.legal.demo.features.chatbot.models.ChatRequest;
import com.legal.demo.features.chatbot.models.ChatResponse;
import org.apache.tika.exception.TikaException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;
import reactor.core.publisher.Flux;

import java.io.IOException;

@Service
public class PostChat implements Command<String, Flux<String>> {

    private final AIModelClient aiModelClient;

    public PostChat(AIModelClient aiModelClient) {
        this.aiModelClient = aiModelClient;
    }

    @Override
    public ResponseEntity<Flux<String>> execute(String text) throws TikaException, IOException, SAXException {

        Flux<String> responseStream = aiModelClient.sendToChatLLM(text);

        return ResponseEntity.ok(responseStream);
    }
}
