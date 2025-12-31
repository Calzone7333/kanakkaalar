package com.calzone.financial.lead;

import com.calzone.financial.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findAllByOwnerOrderByCreatedAtDesc(User owner);
    Optional<Lead> findByIdAndOwner(Long id, User owner);
    Optional<Lead> findByEmail(String email);
    List<Lead> findAllByOrderByCreatedAtDesc();
}
