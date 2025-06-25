package com.legal.demo.features.summary.models1;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FinancialItem {
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

    public FinancialItem() {}

    public FinancialItem(String type, String description, String amount, String frequency, String dueDate) {
        this.type = type;
        this.description = description;
        this.amount = amount;
        this.frequency = frequency;
        this.dueDate = dueDate;
    }

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    @Override
    public String toString() {
        return "FinancialItem{" +
                "type='" + type + '\'' +
                ", description='" + description + '\'' +
                ", amount='" + amount + '\'' +
                ", frequency='" + frequency + '\'' +
                ", dueDate='" + dueDate + '\'' +
                '}';
    }
}
