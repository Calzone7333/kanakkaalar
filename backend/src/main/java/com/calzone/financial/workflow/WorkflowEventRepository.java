package com.calzone.financial.workflow;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkflowEventRepository extends JpaRepository<WorkflowEvent, Long> {
    
    // Spring Data JPA query creation from method name (implicitly ordered DESC)
    List<WorkflowEvent> findByOrderIdOrderByCreatedAtDesc(Long orderId);

    // Spring Data JPA query creation from method name (implicitly ordered DESC)
    List<WorkflowEvent> findByOrderIdAndStageOrderByCreatedAtDesc(Long orderId, WorkflowStage stage);

    // Explicit @Query is used, so the method name is mostly descriptive.
    // The JPQL correctly uses the 'IN' clause for the List parameter.
    @Query("SELECT w FROM com_calzone_financial_workflow_WorkflowEvent w WHERE w.orderId = :orderId AND w.stage IN :stages ORDER BY w.createdAt DESC")
    List<WorkflowEvent> findEventsByOrderIdAndStageIn(
            @Param("orderId") Long orderId,
            @Param("stages") List<WorkflowStage> stages
    );

    // Explicit @Query for filtering by status
    @Query("SELECT w FROM com_calzone_financial_workflow_WorkflowEvent w WHERE w.orderId = :orderId AND w.status = :status ORDER BY w.createdAt DESC")
    List<WorkflowEvent> findByOrderIdAndStatus(
            @Param("orderId") Long orderId,
            @Param("status") WorkflowStatus status
    );

    // Explicit @Query for filtering by date range using BETWEEN
    @Query("SELECT w FROM com_calzone_financial_workflow_WorkflowEvent w WHERE w.createdAt BETWEEN :startDate AND :endDate ORDER BY w.createdAt DESC")
    List<WorkflowEvent> findByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Spring Data JPA query creation for count
    long countByOrderIdAndStatus(Long orderId, WorkflowStatus status);

    // Spring Data JPA query creation from method name (implicitly ordered DESC)
    List<WorkflowEvent> findByStageAndStatusOrderByCreatedAtDesc(WorkflowStage stage, WorkflowStatus status);
}
