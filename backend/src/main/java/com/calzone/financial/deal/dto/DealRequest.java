package com.calzone.financial.deal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record DealRequest(
    @NotBlank(message = "Name is required")
    String name,

    @NotBlank(message = "Customer is required")
    String customer,

    @NotBlank(message = "Amount is required")
    String amount,

    @NotBlank(message = "Stage is required")
    String stage,

    @NotNull(message = "Probability is required")
    Integer probability,

    String owner,

    LocalDate dueDate
) {}
