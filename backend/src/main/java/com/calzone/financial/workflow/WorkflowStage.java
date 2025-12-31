package com.calzone.financial.workflow;

public enum WorkflowStage {
    APP_REC(1, "Application Received", "Customer initiated the service order"),
    DOC_VER(2, "Document Verification", "Expert reviewing uploaded documents"),
    PROC(3, "Processing", "Application processing initiated"),
    DRAFT(4, "Drafting", "Drafting legal documents"),
    FILING(5, "Filing", "Filing with government portal"),
    GOVT_REV(6, "Govt Review", "Under government review"),
    APPR(7, "Approval", "Application approved"),
    DEL(8, "Delivery", "Final delivery to customer"),
    
    // Exception stages
    PF(0, "Payment Failure", "Payment processing failure"),
    MD(0, "Missing Documents", "Incomplete/invalid docs"),
    GO(0, "Govt Objection", "Government rejection"),
    SLAB(0, "SLA Breach", "SLA breach risk detected"),
    CR(0, "Cancellation Request", "Cancellation/Refund");

    private final int sequence;
    private final String label;
    private final String description;

    WorkflowStage(int sequence, String label, String description) {
        this.sequence = sequence;
        this.label = label;
        this.description = description;
    }

    public int getSequence() { return sequence; }
    public String getLabel() { return label; }
    public String getDescription() { return description; }

    public boolean isMainStage() { return sequence > 0; }
    public boolean isException() { return sequence == 0; }
}
