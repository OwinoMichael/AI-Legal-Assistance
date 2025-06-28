package com.legal.demo.features.summary.models1;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FinancialItem {

    @JsonProperty("id")
    private String id;

    @JsonProperty("type")
    private String type;

    @JsonProperty("description")
    private String description;

    @JsonProperty("amount")
    private String amount;

    @JsonProperty("frequency")
    private String frequency;

    @JsonProperty("due_date")
    private String dueDate;

    @JsonProperty("currency")
    private String currency;

    @JsonProperty("is_recurring")
    private Boolean isRecurring;

    public FinancialItem() {
    }

    public FinancialItem(String type, String description, String amount, String frequency, String dueDate, String currency, Boolean isRecurring) {
        this.type = type;
        this.description = description;
        this.amount = amount;
        this.frequency = frequency;
        this.dueDate = dueDate;
        this.currency = currency;
        this.isRecurring = isRecurring;
    }

    // Getters and Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Boolean getRecurring() {
        return isRecurring;
    }

    public void setRecurring(Boolean recurring) {
        isRecurring = recurring;
    }

    @Override
    public String toString() {
        return "FinancialItem{" +
                "type='" + type + '\'' +
                ", description='" + description + '\'' +
                ", amount='" + amount + '\'' +
                ", frequency='" + frequency + '\'' +
                ", dueDate='" + dueDate + '\'' +
                ", currency='" + currency + '\'' +
                ", isRecurring=" + isRecurring +
                '}';
    }
}

