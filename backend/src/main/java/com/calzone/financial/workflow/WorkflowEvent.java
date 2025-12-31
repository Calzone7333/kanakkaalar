package com.calzone.financial.workflow;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "com_calzone_financial_workflow_WorkflowEvent")
@Table(name = "workflow_events", indexes = {
        @Index(name = "idx_order_id", columnList = "orderId"),
        @Index(name = "idx_stage", columnList = "stage"),
        @Index(name = "idx_created_at", columnList = "createdAt")
})
public class WorkflowEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private WorkflowStage stage;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private WorkflowStatus status;

    @Column
    private String description;

    @Column
    private String details;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public WorkflowEvent() {}

    public WorkflowEvent(Long orderId, WorkflowStage stage, WorkflowStatus status, String description) {
        this.orderId = orderId;
        this.stage = stage;
        this.status = status;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public WorkflowStage getStage() { return stage; }
    public void setStage(WorkflowStage stage) { this.stage = stage; }

    public WorkflowStatus getStatus() { return status; }
    public void setStatus(WorkflowStatus status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
