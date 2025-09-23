package com.legal.demo.features.chatbot.models;

public class ChatRequest {

    private String chat;

    public ChatRequest() {
    }

    public ChatRequest(String chat) {
        this.chat = chat;
    }

    public String getChat() {
        return chat;
    }

    public void setChat(String chat) {
        this.chat = chat;
    }
}
