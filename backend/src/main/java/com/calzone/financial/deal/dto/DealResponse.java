package com.calzone.financial.deal.dto;

import java.time.LocalDate;
import java.time.Instant;

public record DealResponse(
    Long id,
    String name,
    String customer,
    String amount,
    String stage,
    Integer probability,
    String owner,
    LocalDate dueDate,
    Instant createdAt,
    Instant updatedAt
) {}
