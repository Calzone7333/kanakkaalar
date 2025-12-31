package com.calzone.financial.auth.dto;

/**
 * Data Transfer Object (DTO) for safely sending user profile information to the frontend.
 * This object does not include sensitive information like password or image binary data.
 */
public class UserProfile {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private boolean hasProfileImage;

    public UserProfile() {
    }

    public UserProfile(Long id, String fullName, String email, String phone, boolean hasProfileImage) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.hasProfileImage = hasProfileImage;
    }

    // ==================== Getters ====================
    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public boolean getHasProfileImage() {
        return hasProfileImage;
    }

    // ==================== Setters ====================
    public void setId(Long id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setHasProfileImage(boolean hasProfileImage) {
        this.hasProfileImage = hasProfileImage;
    }
}
