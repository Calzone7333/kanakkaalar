package com.calzone.financial.email;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {

    @Query("select v from VerificationCode v where v.email = :email and v.used = false and v.expiresAt > :now order by v.createdAt desc")
    Optional<VerificationCode> findActiveLatest(String email, Instant now);

    @Transactional
    @Modifying
    @Query("delete from VerificationCode v where v.email = :email or v.expiresAt < :now")
    int purgeByEmailOrExpired(String email, Instant now);
}
