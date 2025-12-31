package com.calzone.financial.workflow;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/workflow")
public class WorkflowController {

    @GetMapping("/orders/{orderId}/timeline")
    public ResponseEntity<List<Map<String, Object>>> timeline(@PathVariable Long orderId) {
        List<Map<String, Object>> events = new ArrayList<>();
        events.add(Map.of(
            "id", 1L,
            "orderId", orderId,
            "stage", "APP_REC",
            "status", "COMPLETED",
            "description", "Application received successfully",
            "details", "Customer initiated the service order",
            "createdAt", LocalDateTime.now().minusDays(5).toString()
        ));
        events.add(Map.of(
            "id", 2L,
            "orderId", orderId,
            "stage", "DOC_VER",
            "status", "IN_PROGRESS",
            "description", "Document verification in progress",
            "details", "Expert reviewing uploaded documents",
            "createdAt", LocalDateTime.now().minusDays(1).toString()
        ));
        return ResponseEntity.ok(events);
    }

    @GetMapping("/orders/{orderId}/progress")
    public ResponseEntity<Map<String, Object>> progress(@PathVariable Long orderId) {
        List<Map<String, Object>> stages = new ArrayList<>();
        stages.add(Map.of("sequence", 1, "stage", "APP_REC", "label", "Application Received", "status", "COMPLETED"));
        stages.add(Map.of("sequence", 2, "stage", "DOC_VER", "label", "Document Verification", "status", "IN_PROGRESS"));
        stages.add(Map.of("sequence", 3, "stage", "PROC", "label", "Processing", "status", "PENDING"));
        stages.add(Map.of("sequence", 4, "stage", "DRAFT", "label", "Drafting", "status", "PENDING"));
        stages.add(Map.of("sequence", 5, "stage", "FILING", "label", "Filing", "status", "PENDING"));
        stages.add(Map.of("sequence", 6, "stage", "GOVT_REV", "label", "Govt Review", "status", "PENDING"));
        stages.add(Map.of("sequence", 7, "stage", "APPR", "label", "Approval", "status", "PENDING"));
        stages.add(Map.of("sequence", 8, "stage", "DEL", "label", "Delivery", "status", "PENDING"));

        Map<String, Object> prog = new HashMap<>();
        prog.put("orderId", orderId);
        prog.put("currentStage", "DOC_VER");
        prog.put("completionPercentage", 25);
        prog.put("stages", stages);
        return ResponseEntity.ok(prog);
    }

    @GetMapping("/orders/{orderId}/current-stage")
    public ResponseEntity<Map<String, Object>> current(@PathVariable Long orderId) {
        Map<String, Object> current = Map.of("stage", "Drafting MOA/AOA", "etaDays", 3);
        return ResponseEntity.ok(current);
    }

    @PostMapping("/orders/{orderId}/advance")
    public ResponseEntity<?> advance(@PathVariable Long orderId, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok(Map.of("status","advanced","orderId",orderId));
    }

    @PostMapping("/orders/{orderId}/complete")
    public ResponseEntity<?> complete(@PathVariable Long orderId, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok(Map.of("status","completed","orderId",orderId));
    }

    @PostMapping("/orders/{orderId}/fail")
    public ResponseEntity<?> fail(@PathVariable Long orderId, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok(Map.of("status","failed","orderId",orderId));
    }

    @PostMapping("/orders/{orderId}/event")
    public ResponseEntity<?> event(@PathVariable Long orderId, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok(Map.of("status","event_created","orderId",orderId, "event", body));
    }

    @PostMapping("/orders/{orderId}/exception")
    public ResponseEntity<?> exception(@PathVariable Long orderId, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok(Map.of("status","exception_added","orderId",orderId));
    }

    @GetMapping("/orders/{orderId}/exceptions")
    public ResponseEntity<List<Map<String,Object>>> exceptions(@PathVariable Long orderId) {
        return ResponseEntity.ok(List.of(Map.of("id",1,"type","missing_docs","status","open")));
    }

    @GetMapping("/stages")
    public ResponseEntity<List<String>> stages() {
        return ResponseEntity.ok(List.of("Intake","Drafting","Filing","Processing","Delivery"));
    }
}
