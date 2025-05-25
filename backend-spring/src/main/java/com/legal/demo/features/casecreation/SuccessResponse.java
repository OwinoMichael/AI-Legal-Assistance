package com.legal.demo.features.casecreation;

public class SuccessResponse {

    private String message;

    public SuccessResponse() {
    }

    public SuccessResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
