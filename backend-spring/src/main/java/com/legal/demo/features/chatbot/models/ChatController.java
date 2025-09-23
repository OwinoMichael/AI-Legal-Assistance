package com.legal.demo.features.chatbot.models;


import com.legal.demo.features.chatbot.commandhandler.PostChat;
import org.apache.tika.exception.TikaException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;
import reactor.core.publisher.Flux;

import java.io.IOException;

@RestController
@RequestMapping("/chat-msg")
public class ChatController {

    private final PostChat postChat;

    public ChatController(PostChat postChat) {
        this.postChat = postChat;
    }

    @PostMapping(value = "/", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<Flux<String>> generateResponse(@RequestBody String text) throws TikaException, IOException, SAXException {
        return postChat.execute(text);
    }
}
