package com.calzone.financial.auth.dto;

public record AuthResponse(
        String token,
        UserProfile user
) {
}
