package com.calzone.financial.casemgmt;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<CaseRecord, Long> {
}
