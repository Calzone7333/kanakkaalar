package com.calzone.financial.workflow;

public enum WorkflowStatus {
    PENDING("Pending - Not started"),
    IN_PROGRESS("In Progress - Currently being worked on"),
    COMPLETED("Completed - Successfully finished"),
    FAILED("Failed - Encountered an error"),
    BLOCKED("Blocked - Waiting for external input"),
    ON_HOLD("On Hold - Temporarily paused");

    private final String description;

    WorkflowStatus(String description) {
        this.description = description;
    }

    public String getDescription() { return description; }
}
