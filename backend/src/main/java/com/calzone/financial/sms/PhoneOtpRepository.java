package com.calzone.financial.sms;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface PhoneOtpRepository extends JpaRepository<PhoneOtp, Long> {

    // FIX: This method definition is missing and MUST be added to resolve the error.
    @Modifying
    @Transactional
    @Query("DELETE FROM PhoneOtp otp WHERE otp.phone = ?1 OR otp.expiresAt < ?2")
    int purgeByPhoneOrExpired(String phone, Instant expiredBefore); 
    
    // This method is also required by PhoneAuthController's verifyPhone() endpoint
    @Query(value = "SELECT otp FROM PhoneOtp otp WHERE otp.phone = ?1 AND otp.expiresAt > ?2 AND otp.used = false ORDER BY otp.id DESC LIMIT 1")
    Optional<PhoneOtp> findActiveLatest(String phone, Instant now);
}