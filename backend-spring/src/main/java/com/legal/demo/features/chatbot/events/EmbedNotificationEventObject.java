package com.legal.demo.features.chatbot.events;

import com.legal.demo.domain.legalcase.Document;

public class EmbedNotificationEventObject {

    private String status;
    private Document document;

    public EmbedNotificationEventObject() {
    }

    public EmbedNotificationEventObject(String status, Document document) {
        this.status = status;
        this.document = document;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }
}
