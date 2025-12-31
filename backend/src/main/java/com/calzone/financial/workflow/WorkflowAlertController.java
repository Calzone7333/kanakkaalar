package com.calzone.financial.workflow;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/workflow/alerts")
@CrossOrigin(origins = "*")
public class WorkflowAlertController {
    private final WorkflowAlertRepository alertRepository;

    public WorkflowAlertController(WorkflowAlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<List<WorkflowAlert>> getOrderAlerts(@PathVariable Long orderId) {
        List<WorkflowAlert> alerts = alertRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/orders/{orderId}/unresolved")
    public ResponseEntity<List<WorkflowAlert>> getUnresolvedAlerts(@PathVariable Long orderId) {
        List<WorkflowAlert> alerts = alertRepository.findUnresolvedByOrderId(orderId);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/unresolved")
    public ResponseEntity<List<WorkflowAlert>> getAllUnresolvedAlerts() {
        List<WorkflowAlert> alerts = alertRepository.findAllUnresolved();
        return ResponseEntity.ok(alerts);
    }

    @PostMapping
    public ResponseEntity<WorkflowAlert> createAlert(@RequestBody AlertRequest request) {
        WorkflowAlert alert = new WorkflowAlert(
                request.getOrderId(),
                WorkflowAlert.AlertType.valueOf(request.getAlertType()),
                request.getTitle(),
                request.getMessage()
        );
        alert.setActionUrl(request.getActionUrl());
        WorkflowAlert saved = alertRepository.save(alert);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{alertId}/resolve")
    public ResponseEntity<WorkflowAlert> resolveAlert(
            @PathVariable Long alertId,
            @RequestBody ResolveRequest request
    ) {
        WorkflowAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        alert.setResolved(true);
        alert.setResolvedAt(LocalDateTime.now());
        alert.setResolvedBy(request.getResolvedBy());
        WorkflowAlert updated = alertRepository.save(alert);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{alertId}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long alertId) {
        alertRepository.deleteById(alertId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count/{orderId}")
    public ResponseEntity<Long> getUnresolvedCount(@PathVariable Long orderId) {
        long count = alertRepository.countByOrderIdAndResolved(orderId, false);
        return ResponseEntity.ok(count);
    }

    public static class AlertRequest {
        private Long orderId;
        private String alertType;
        private String title;
        private String message;
        private String actionUrl;

        public Long getOrderId() { return orderId; }
        public void setOrderId(Long orderId) { this.orderId = orderId; }

        public String getAlertType() { return alertType; }
        public void setAlertType(String alertType) { this.alertType = alertType; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getActionUrl() { return actionUrl; }
        public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }
    }

    public static class ResolveRequest {
        private String resolvedBy;

        public String getResolvedBy() { return resolvedBy; }
        public void setResolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; }
    }
}
