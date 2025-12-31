package com.calzone.financial.workflow;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/workflow/analytics")
@CrossOrigin(origins = "*")
public class WorkflowStatisticsController {
    
    private final WorkflowEventRepository eventRepository;

    public WorkflowStatisticsController(WorkflowEventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        // Count active stages
        long completedCount = eventRepository.count() > 0 ? 
            eventRepository.findAll().stream()
                .filter(e -> e.getStatus() == WorkflowStatus.COMPLETED && e.getStage().isMainStage())
                .count() : 0;
        
        long inProgressCount = eventRepository.findAll().stream()
            .filter(e -> e.getStatus() == WorkflowStatus.IN_PROGRESS && e.getStage().isMainStage())
            .count();
        
        long failedCount = eventRepository.findAll().stream()
            .filter(e -> e.getStatus() == WorkflowStatus.FAILED)
            .count();
        
        long blockedCount = eventRepository.findAll().stream()
            .filter(e -> e.getStatus() == WorkflowStatus.BLOCKED)
            .count();

        stats.setCompletedStages(completedCount);
        stats.setInProgressStages(inProgressCount);
        stats.setFailedStages(failedCount);
        stats.setBlockedStages(blockedCount);
        stats.setTotalEvents(eventRepository.count());
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stage-stats")
    public ResponseEntity<List<StageStatDTO>> getStageStats() {
        List<StageStatDTO> stats = new ArrayList<>();
        
        for (WorkflowStage stage : WorkflowStage.values()) {
            if (!stage.isMainStage()) continue;
            
            StageStatDTO stat = new StageStatDTO();
            stat.setStage(stage.name());
            stat.setLabel(stage.getLabel());
            
            List<WorkflowEvent> events = eventRepository.findByStageAndStatusOrderByCreatedAtDesc(
                stage, WorkflowStatus.COMPLETED
            );
            stat.setCompletedCount(events.size());
            
            List<WorkflowEvent> failedEvents = eventRepository.findByStageAndStatusOrderByCreatedAtDesc(
                stage, WorkflowStatus.FAILED
            );
            stat.setFailedCount(failedEvents.size());
            
            stats.add(stat);
        }
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/exception-stats")
    public ResponseEntity<List<ExceptionStatDTO>> getExceptionStats() {
        List<ExceptionStatDTO> stats = new ArrayList<>();
        
        WorkflowStage[] exceptions = {
            WorkflowStage.PF, WorkflowStage.MD, WorkflowStage.GO, 
            WorkflowStage.SLAB, WorkflowStage.CR
        };
        
        for (WorkflowStage exc : exceptions) {
            ExceptionStatDTO stat = new ExceptionStatDTO();
            stat.setException(exc.name());
            stat.setLabel(exc.getLabel());
            
            long count = eventRepository.findAll().stream()
                .filter(e -> e.getStage() == exc)
                .count();
            stat.setCount(count);
            
            stats.add(stat);
        }
        
        return ResponseEntity.ok(stats);
    }

    public static class DashboardStatsDTO {
        private long completedStages;
        private long inProgressStages;
        private long failedStages;
        private long blockedStages;
        private long totalEvents;

        public long getCompletedStages() { return completedStages; }
        public void setCompletedStages(long completedStages) { this.completedStages = completedStages; }

        public long getInProgressStages() { return inProgressStages; }
        public void setInProgressStages(long inProgressStages) { this.inProgressStages = inProgressStages; }

        public long getFailedStages() { return failedStages; }
        public void setFailedStages(long failedStages) { this.failedStages = failedStages; }

        public long getBlockedStages() { return blockedStages; }
        public void setBlockedStages(long blockedStages) { this.blockedStages = blockedStages; }

        public long getTotalEvents() { return totalEvents; }
        public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }
    }

    public static class StageStatDTO {
        private String stage;
        private String label;
        private long completedCount;
        private long failedCount;

        public String getStage() { return stage; }
        public void setStage(String stage) { this.stage = stage; }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public long getCompletedCount() { return completedCount; }
        public void setCompletedCount(long completedCount) { this.completedCount = completedCount; }

        public long getFailedCount() { return failedCount; }
        public void setFailedCount(long failedCount) { this.failedCount = failedCount; }
    }

    public static class ExceptionStatDTO {
        private String exception;
        private String label;
        private long count;

        public String getException() { return exception; }
        public void setException(String exception) { this.exception = exception; }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }
}
