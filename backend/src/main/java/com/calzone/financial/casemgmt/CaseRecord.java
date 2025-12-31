package com.calzone.financial.casemgmt;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "CaseRecordCasemgmt")
@Table(name = "cases")
public class CaseRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String serviceType;
    private String status = "OPEN";
    private LocalDateTime createdAt = LocalDateTime.now();

    public CaseRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
