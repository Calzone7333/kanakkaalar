package com.calzone.financial.process;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/process")
public class ProcessController {

    public record StageReq(String stage, String status, String notes) {}

    private final ProcessStageRepository repo;

    public ProcessController(ProcessStageRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<List<ProcessStage>> list(@PathVariable Long orderId) {
        return ResponseEntity.ok(repo.findByOrderIdOrderByCreated(orderId));
    }

    @PostMapping("/orders/{orderId}/stage")
    public ResponseEntity<ProcessStage> add(@PathVariable Long orderId, @RequestBody StageReq req) {
        ProcessStage s = new ProcessStage();
        s.setOrderId(orderId);
        s.setStage(req.stage() == null ? "WEB" : req.stage());
        s.setStatus(req.status() == null ? "completed" : req.status());
        s.setNotes(req.notes());
        return ResponseEntity.ok(repo.save(s));
    }
}
