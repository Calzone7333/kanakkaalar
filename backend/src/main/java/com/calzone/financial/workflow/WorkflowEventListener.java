package com.calzone.financial.workflow;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class WorkflowEventListener {
    private static final Logger logger = LoggerFactory.getLogger(WorkflowEventListener.class);

    @EventListener
    public void onWorkflowEventCreated(WorkflowEvent event) {
        logger.info("Workflow Event Created: Order {} - Stage {} - Status {}",
                event.getOrderId(), event.getStage(), event.getStatus());

        if (event.getStatus() == WorkflowStatus.FAILED) {
            logger.warn("Stage Failed: Order {} - Stage {} - Description: {}",
                    event.getOrderId(), event.getStage(), event.getDescription());
        }

        if (event.getStage().isException()) {
            logger.warn("Exception Detected: Order {} - Exception {} - Description: {}",
                    event.getOrderId(), event.getStage(), event.getDescription());
        }

        if (event.getStatus() == WorkflowStatus.COMPLETED && event.getStage() == WorkflowStage.DEL) {
            logger.info("Order Completed: Order {} - Delivery Complete", event.getOrderId());
        }
    }
}
