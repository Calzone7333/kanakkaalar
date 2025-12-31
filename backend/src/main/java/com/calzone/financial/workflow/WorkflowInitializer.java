package com.calzone.financial.workflow;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class WorkflowInitializer {
    private static final Logger logger = LoggerFactory.getLogger(WorkflowInitializer.class);

    @Bean
    public ApplicationRunner initializeWorkflowSampleData(
            WorkflowEventRepository eventRepository,
            WorkflowAlertRepository alertRepository) {
        return args -> {
            logger.info("Initializing workflow sample data...");

            try {
                // Check if sample data already exists
                if (eventRepository.count() > 0) {
                    logger.info("Sample data already exists, skipping initialization");
                    return;
                }

                Long sampleOrderId = 1002L;

                // Create sample workflow events
                WorkflowEvent event1 = new WorkflowEvent(
                        sampleOrderId,
                        WorkflowStage.APP_REC,
                        WorkflowStatus.COMPLETED,
                        "Application received successfully"
                );
                event1.setDetails("Customer submitted application details");
                eventRepository.save(event1);

                WorkflowEvent event2 = new WorkflowEvent(
                        sampleOrderId,
                        WorkflowStage.DOC_VER,
                        WorkflowStatus.COMPLETED,
                        "Documents verified successfully"
                );
                event2.setDetails("All required documents are valid");
                eventRepository.save(event2);

                WorkflowEvent event3 = new WorkflowEvent(
                        sampleOrderId,
                        WorkflowStage.PROC,
                        WorkflowStatus.COMPLETED,
                        "Processing initiated"
                );
                event3.setDetails("Application moved to processing stage");
                eventRepository.save(event3);

                WorkflowEvent event4 = new WorkflowEvent(
                        sampleOrderId,
                        WorkflowStage.DRAFT,
                        WorkflowStatus.IN_PROGRESS,
                        "Drafting legal documents"
                );
                event4.setDetails("Preparing MOA/AOA");
                eventRepository.save(event4);

                // Create sample alert
                WorkflowAlert alert = new WorkflowAlert(
                        sampleOrderId,
                        WorkflowAlert.AlertType.DOCUMENT_MISSING,
                        "Document Verification Pending",
                        "Aadhar proof is pending. Please upload for verification."
                );
                alert.setActionUrl("/dashboard/orders/" + sampleOrderId);
                alertRepository.save(alert);

                logger.info("Sample workflow data initialized successfully");
            } catch (Exception e) {
                logger.error("Error initializing sample data", e);
            }
        };
    }
}
