package com.calzone.financial.user;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity(name = "com_calzone_financial_user_User")
@Table(name = "users", uniqueConstraints = @UniqueConstraint(name = "uk_users_email", columnNames = "email"))
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    private Boolean phoneVerified = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private java.util.Set<Role> roles = new java.util.HashSet<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @Column(nullable = false)
    private Boolean emailVerified = false;

    @Column(columnDefinition = "TEXT")
    private String address;

    // Profile image stored as binary data in database
    @Lob
    @JsonIgnore
    @Column(name = "profile_image", columnDefinition = "LONGBLOB")
    private byte[] profileImage;

    // Content type of the profile image (e.g., "image/png")
    @Column(name = "profile_image_type")
    private String profileImageType;

    // --- Agent / Extended Profile Fields ---
    private String state;
    private String city;

    @Column(name = "aadhaar_number")
    private String aadhaarNumber;

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "firm_name")
    private String firmName;

    @Column(name = "referral_code")
    private String referralCode;

    // Bank Details
    @Column(name = "bank_holder_name")
    private String bankHolderName;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "bank_ifsc")
    private String bankIfsc;

    @Column(name = "bank_name")
    private String bankName;

    // Documents (Blobs)
    @Lob
    @JsonIgnore
    @Column(name = "aadhaar_front", columnDefinition = "LONGBLOB")
    private byte[] aadhaarFront;
    @Column(name = "aadhaar_front_type")
    private String aadhaarFrontType;

    @Lob
    @JsonIgnore
    @Column(name = "aadhaar_back", columnDefinition = "LONGBLOB")
    private byte[] aadhaarBack;
    @Column(name = "aadhaar_back_type")
    private String aadhaarBackType;

    @Lob
    @JsonIgnore
    @Column(name = "pan_card", columnDefinition = "LONGBLOB")
    private byte[] panCard;
    @Column(name = "pan_card_type")
    private String panCardType;

    // ==================== Lifecycle Hooks ====================
    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
        if (emailVerified == null)
            emailVerified = false;
        if (phone == null)
            phone = "";
        if (fullName == null)
            fullName = "";
        if (passwordHash == null)
            passwordHash = "";
        if (phoneVerified == null)
            phoneVerified = false;
        if (address == null)
            address = "";
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }

    @Column(nullable = false)
    private Boolean enabled = true;

    // ==================== Getters & Setters ====================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setPassword(String password) {
        this.passwordHash = password;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public Boolean getPhoneVerified() {
        return phoneVerified;
    }

    public void setPhoneVerified(Boolean phoneVerified) {
        this.phoneVerified = phoneVerified;
    }

    public java.util.Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(java.util.Set<Role> roles) {
        this.roles = roles;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public byte[] getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(byte[] profileImage) {
        this.profileImage = profileImage;
    }

    public String getProfileImageType() {
        return profileImageType;
    }

    public void setProfileImageType(String profileImageType) {
        this.profileImageType = profileImageType;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }

    public String getFirmName() {
        return firmName;
    }

    public void setFirmName(String firmName) {
        this.firmName = firmName;
    }

    public String getReferralCode() {
        return referralCode;
    }

    public void setReferralCode(String referralCode) {
        this.referralCode = referralCode;
    }

    public String getBankHolderName() {
        return bankHolderName;
    }

    public void setBankHolderName(String bankHolderName) {
        this.bankHolderName = bankHolderName;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getBankIfsc() {
        return bankIfsc;
    }

    public void setBankIfsc(String bankIfsc) {
        this.bankIfsc = bankIfsc;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public byte[] getAadhaarFront() {
        return aadhaarFront;
    }

    public void setAadhaarFront(byte[] aadhaarFront) {
        this.aadhaarFront = aadhaarFront;
    }

    public String getAadhaarFrontType() {
        return aadhaarFrontType;
    }

    public void setAadhaarFrontType(String aadhaarFrontType) {
        this.aadhaarFrontType = aadhaarFrontType;
    }

    public byte[] getAadhaarBack() {
        return aadhaarBack;
    }

    public void setAadhaarBack(byte[] aadhaarBack) {
        this.aadhaarBack = aadhaarBack;
    }

    public String getAadhaarBackType() {
        return aadhaarBackType;
    }

    public void setAadhaarBackType(String aadhaarBackType) {
        this.aadhaarBackType = aadhaarBackType;
    }

    public byte[] getPanCard() {
        return panCard;
    }

    public void setPanCard(byte[] panCard) {
        this.panCard = panCard;
    }

    public String getPanCardType() {
        return panCardType;
    }

    public void setPanCardType(String panCardType) {
        this.panCardType = panCardType;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    // ==================== UserDetails Methods ====================
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (roles == null || roles.isEmpty()) {
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }
        return roles.stream().map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName())).toList();
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled != null ? enabled : true;
    }

    // Helper method to check if a profile image exists
    public boolean hasProfileImage() {
        return this.profileImage != null && this.profileImage.length > 0;
    }

    // ==================== Builder Pattern ====================
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String fullName;
        private String email;
        private String phone;
        private String password;
        private Boolean emailVerified = false;

        public Builder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder password(String password) {
            this.password = password;
            return this;
        }

        public Builder emailVerified(Boolean emailVerified) {
            this.emailVerified = emailVerified;
            return this;
        }

        public User build() {
            User user = new User();
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPhone(phone);
            user.setPassword(password);
            user.setEmailVerified(emailVerified);
            return user;
        }
    }
}
