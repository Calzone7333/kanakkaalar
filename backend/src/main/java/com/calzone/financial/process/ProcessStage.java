package com.calzone.financial.process;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Entity representing a single stage in a process pipeline.
 * Example stages: APP_REC, DOC_VER, PROC, DRAFT, FILING, GOVT_REV, APPR, DEL, PF, MD, GO, SLAB, CR.
 */
@Entity
@Table(
    name = "process_stages",
    indexes = {
        @Index(name = "idx_process_order", columnList = "order_id"),
        @Index(name = "idx_process_created", columnList = "created_at")
    }
)
public class ProcessStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(nullable = false, length = 50)
    private String stage;  // e.g., WEB, CRM, SALES, etc.

    @Column(nullable = false, length = 20)
    private String status; // e.g., completed, pending, failed, info

    @Column(length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // ------------------------
    // Constructors
    // ------------------------

    public ProcessStage() {
        // Default constructor for JPA
    }

    public ProcessStage(Long orderId, String stage, String status, String notes) {
        this.orderId = orderId;
        this.stage = stage;
        this.status = (status == null || status.isBlank()) ? "completed" : status;
        this.notes = notes;
    }

    // ------------------------
    // Lifecycle hooks
    // ------------------------

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (status == null || status.isBlank()) {
            status = "completed";
        }
    }

    // ------------------------
    // Getters & Setters
    // ------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    // ------------------------
    // toString (optional)
    // ------------------------

    @Override
    public String toString() {
        return "ProcessStage{" +
                "id=" + id +
                ", orderId=" + orderId +
                ", stage='" + stage + '\'' +
                ", status='" + status + '\'' +
                ", notes='" + notes + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
