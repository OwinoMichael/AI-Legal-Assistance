package com.legal.demo.features.summary.models1;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ComplianceItem {

    @JsonProperty("requirement")
    private String requirement;

    @JsonProperty("status")
    private String status;

    @JsonProperty("deadline")
    private String deadline;

    @JsonProperty("responsible_party")
    private String responsibleParty;

    @JsonProperty("consequences")
    private String consequences;

    public ComplianceItem() {
    }

    public ComplianceItem(String requirement, String status, String deadline, String responsibleParty, String consequences) {
        this.requirement = requirement;
        this.status = status;
        this.deadline = deadline;
        this.responsibleParty = responsibleParty;
        this.consequences = consequences;
    }

    public String getRequirement() {
        return requirement;
    }

    public void setRequirement(String requirement) {
        this.requirement = requirement;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getResponsibleParty() {
        return responsibleParty;
    }

    public void setResponsibleParty(String responsibleParty) {
        this.responsibleParty = responsibleParty;
    }

    public String getConsequences() {
        return consequences;
    }

    public void setConsequences(String consequences) {
        this.consequences = consequences;
    }

    @Override
    public String toString() {
        return "ComplianceItem{" +
                "requirement='" + requirement + '\'' +
                ", status='" + status + '\'' +
                ", deadline='" + deadline + '\'' +
                ", responsibleParty='" + responsibleParty + '\'' +
                ", consequences='" + consequences + '\'' +
                '}';
    }
}
