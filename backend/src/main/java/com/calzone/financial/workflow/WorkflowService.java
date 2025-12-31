package com.calzone.financial.workflow;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkflowService {
    private final WorkflowEventRepository eventRepository;

    public WorkflowService(WorkflowEventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public WorkflowEvent createEvent(Long orderId, WorkflowStage stage, WorkflowStatus status, String description, String details) {
        WorkflowEvent event = new WorkflowEvent(orderId, stage, status, description);
        event.setDetails(details);
        return eventRepository.save(event);
    }

    public List<WorkflowEvent> getOrderTimeline(Long orderId) {
        return eventRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
    }

    public WorkflowStage getCurrentStage(Long orderId) {
        List<WorkflowEvent> events = eventRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
        if (events.isEmpty()) return WorkflowStage.APP_REC;

        for (WorkflowEvent event : events) {
            if (event.getStage().isMainStage() && event.getStatus() != WorkflowStatus.FAILED) {
                return event.getStage();
            }
        }
        return WorkflowStage.APP_REC;
    }

    public List<WorkflowEvent> getStageHistory(Long orderId, WorkflowStage stage) {
        return eventRepository.findByOrderIdAndStageOrderByCreatedAtDesc(orderId, stage);
    }

    public WorkflowProgressDTO getWorkflowProgress(Long orderId) {
        List<WorkflowEvent> allEvents = eventRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
        
        WorkflowProgressDTO progress = new WorkflowProgressDTO();
        progress.setOrderId(orderId);

        // Map stages to their status
        Map<WorkflowStage, WorkflowStatus> stageStatus = new HashMap<>();
        // Using reverse order timeline, the first status encountered for a stage is the latest status.
        for (WorkflowEvent event : allEvents) {
            if (!stageStatus.containsKey(event.getStage())) {
                stageStatus.put(event.getStage(), event.getStatus());
            }
        }

        // Build stage details
        List<WorkflowProgressDTO.StageProgress> stages = new ArrayList<>();
        for (WorkflowStage mainStage : WorkflowStage.values()) {
            if (!mainStage.isMainStage()) continue;

            WorkflowProgressDTO.StageProgress sp = new WorkflowProgressDTO.StageProgress();
            sp.setStage(mainStage.name());
            sp.setLabel(mainStage.getLabel());
            sp.setDescription(mainStage.getDescription());
            sp.setSequence(mainStage.getSequence());
            sp.setStatus(stageStatus.getOrDefault(mainStage, WorkflowStatus.PENDING).name());

            List<WorkflowEvent> stageEvents = allEvents.stream()
                    .filter(e -> e.getStage() == mainStage)
                    .collect(Collectors.toList());
            sp.setEvents(stageEvents);

            stages.add(sp);
        }
        progress.setStages(stages);

        // Collect exceptions
        List<WorkflowEvent> exceptions = allEvents.stream()
                .filter(e -> e.getStage().isException())
                .collect(Collectors.toList());
        progress.setExceptions(exceptions);

        progress.setCurrentStage(getCurrentStage(orderId).name());
        progress.setCompletionPercentage(calculateCompletion(stageStatus));

        return progress;
    }

    private int calculateCompletion(Map<WorkflowStage, WorkflowStatus> stageStatus) {
        int completed = (int) stageStatus.values().stream()
                .filter(s -> s == WorkflowStatus.COMPLETED)
                .count();
        int total = 8; // 8 main stages now
        return total > 0 ? (completed * 100) / total : 0;
    }

    public void advanceStage(Long orderId, WorkflowStage nextStage, String description) {
        createEvent(orderId, nextStage, WorkflowStatus.IN_PROGRESS, description, null);
    }

    public void completeStage(Long orderId, WorkflowStage stage, String description) {
        createEvent(orderId, stage, WorkflowStatus.COMPLETED, description, null);
    }

    public void failStage(Long orderId, WorkflowStage stage, String description) {
        createEvent(orderId, stage, WorkflowStatus.FAILED, description, null);
    }

    public void addException(Long orderId, WorkflowStage exceptionType, String description, String details) {
        createEvent(orderId, exceptionType, WorkflowStatus.BLOCKED, description, details);
    }

    public List<WorkflowEvent> getActiveExceptions(Long orderId) {
        List<WorkflowEvent> exceptions = eventRepository.findByOrderIdOrderByCreatedAtDesc(orderId).stream()
                .filter(e -> e.getStage().isException())
                .filter(e -> e.getStatus() == WorkflowStatus.BLOCKED || e.getStatus() == WorkflowStatus.PENDING)
                .collect(Collectors.toList());
        return exceptions;
    }

    public static class WorkflowProgressDTO {
        private Long orderId;
        private String currentStage;
        private int completionPercentage;
        private List<StageProgress> stages;
        private List<WorkflowEvent> exceptions;

        public static class StageProgress {
            private String stage;
            private String label;
            private String description;
            private int sequence;
            private String status;
            private List<WorkflowEvent> events;

            public String getStage() { return stage; }
            public void setStage(String stage) { this.stage = stage; }

            public String getLabel() { return label; }
            public void setLabel(String label) { this.label = label; }

            public String getDescription() { return description; }
            public void setDescription(String description) { this.description = description; }

            public int getSequence() { return sequence; }
            public void setSequence(int sequence) { this.sequence = sequence; }

            public String getStatus() { return status; }
            public void setStatus(String status) { this.status = status; }

            public List<WorkflowEvent> getEvents() { return events; }
            public void setEvents(List<WorkflowEvent> events) { this.events = events; }
        }

        public Long getOrderId() { return orderId; }
        public void setOrderId(Long orderId) { this.orderId = orderId; }

        public String getCurrentStage() { return currentStage; }
        public void setCurrentStage(String currentStage) { this.currentStage = currentStage; }

        public int getCompletionPercentage() { return completionPercentage; }
        public void setCompletionPercentage(int completionPercentage) { this.completionPercentage = completionPercentage; }

        public List<StageProgress> getStages() { return stages; }
        public void setStages(List<StageProgress> stages) { this.stages = stages; }

        public List<WorkflowEvent> getExceptions() { return exceptions; }
        public void setExceptions(List<WorkflowEvent> exceptions) { this.exceptions = exceptions; }
    }
}