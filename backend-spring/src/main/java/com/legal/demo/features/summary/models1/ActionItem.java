package com.legal.demo.features.summary.models1;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ActionItem {
    @JsonProperty("id")
    private String id;

    @JsonProperty("task")
    private String task;

    @JsonProperty("deadline")
    private String deadline;

    @JsonProperty("priority")
    private String priority;

    @JsonProperty("status")
    private String status;

    @JsonProperty("description")
    private String description;

    @JsonProperty("assigned_to")
    private String assignedTo;

    public ActionItem() {}

    public ActionItem(String id, String task, String deadline, String priority, String status, String description, String assignedTo) {
        this.id = id;
        this.task = task;
        this.deadline = deadline;
        this.priority = priority;
        this.status = status;
        this.description = description;
        this.assignedTo = assignedTo;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    @Override
    public String toString() {
        return "ActionItem{" +
                "id='" + id + '\'' +
                ", task='" + task + '\'' +
                ", deadline='" + deadline + '\'' +
                ", priority='" + priority + '\'' +
                ", status='" + status + '\'' +
                ", description='" + description + '\'' +
                ", assignedTo='" + assignedTo + '\'' +
                '}';
    }
}