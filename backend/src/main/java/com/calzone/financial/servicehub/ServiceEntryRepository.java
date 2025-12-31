package com.calzone.financial.servicehub;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceEntryRepository extends JpaRepository<ServiceEntry, Long> {
    List<ServiceEntry> findAllByOrderByTabNameAscSubTabAscDisplayOrderAsc();
}
