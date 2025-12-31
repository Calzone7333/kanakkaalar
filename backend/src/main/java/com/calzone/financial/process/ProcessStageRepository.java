package com.calzone.financial.process;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProcessStageRepository extends JpaRepository<ProcessStage, Long> {
    @Query("select p from ProcessStage p where p.orderId = :orderId order by p.createdAt asc, p.id asc")
    List<ProcessStage> findByOrderIdOrderByCreated(Long orderId);
}
