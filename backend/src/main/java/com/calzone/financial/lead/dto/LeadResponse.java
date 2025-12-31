package com.calzone.financial.lead.dto;

import java.time.Instant;

public record LeadResponse(
        Long id,
        String name,
        String email,
        String phone,
        String service,
        String status,
        String ownerName,
        Instant createdAt,
        Instant updatedAt
) {
}
