package com.calzone.financial.workflow;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkflowAlertRepository extends JpaRepository<WorkflowAlert, Long> {
    List<WorkflowAlert> findByOrderIdOrderByCreatedAtDesc(Long orderId);

    @Query("SELECT w FROM WorkflowAlert w WHERE w.orderId = :orderId AND w.resolved = false ORDER BY w.createdAt DESC")
    List<WorkflowAlert> findUnresolvedByOrderId(@Param("orderId") Long orderId);

    @Query("SELECT w FROM WorkflowAlert w WHERE w.resolved = false ORDER BY w.createdAt DESC")
    List<WorkflowAlert> findAllUnresolved();

    List<WorkflowAlert> findByAlertTypeOrderByCreatedAtDesc(WorkflowAlert.AlertType alertType);

    long countByOrderIdAndResolved(Long orderId, Boolean resolved);
}
