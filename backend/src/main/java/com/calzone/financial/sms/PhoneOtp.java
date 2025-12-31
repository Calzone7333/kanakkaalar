package com.calzone.financial.sms;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

// NOTE: Ensure you applied the previous fix: 
// @Entity(name = "com_calzone_financial_sms_PhoneOtp") MUST BE changed to @Entity 
@Entity 
@Table(name = "phone_otp_codes", indexes = {
    @Index(name = "idx_phoneotp_phone", columnList = "phone"),
    @Index(name = "idx_phoneotp_created", columnList = "createdAt")
})
public class PhoneOtp {
    // --- FIELDS ---
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String phone; // Required setter: setPhone()

    @Column(nullable = false)
    private String codeHash; // Required getter/setter: getCodeHash(), setCodeHash()
    
    @Column(nullable = false)
    private Instant expiresAt; // Required setter: setExpiresAt()
    
    @Column(nullable = false)
    private boolean used; // Required getter/setter: isUsed(), setUsed()

    @Column(nullable = false)
    private int attempts = 0; // Required getter/setter: getAttempts(), setAttempts()

    @Column(nullable = false)
    private int maxAttempts = 5; // Required getter: getMaxAttempts()
    
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
        if (maxAttempts <= 0) maxAttempts = 5;
    }

    // ===================================
    // FIX: ADDED MISSING METHOD BODIES
    // ===================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    // Fixes 'setPhone(String) is undefined' error
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; } 

    // Fixes 'getCodeHash(String) is undefined' and 'setCodeHash(String) is undefined' errors
    public String getCodeHash() { return codeHash; }
    public void setCodeHash(String codeHash) { this.codeHash = codeHash; } 

    // Fixes 'setExpiresAt(Instant) is undefined' error
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    // Fixes 'isUsed() is undefined' and 'setUsed(boolean) is undefined' errors
    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }

    // Fixes 'getAttempts() is undefined' and 'setAttempts(int) is undefined' errors
    public int getAttempts() { return attempts; }
    public void setAttempts(int attempts) { this.attempts = attempts; }

    // Fixes 'getMaxAttempts() is undefined' error
    public int getMaxAttempts() { return maxAttempts; }
    public void setMaxAttempts(int maxAttempts) { this.maxAttempts = maxAttempts; } // Also needed for internal use

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}