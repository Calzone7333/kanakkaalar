package com.calzone.financial.lead.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LeadRequest(
        @NotBlank(message = "Name cannot be empty") @Size(max = 120, message = "Name can be at most 120 characters") String name,

        @Size(max = 160, message = "Service can be at most 160 characters") String service,

        @NotBlank(message = "Email cannot be empty") @Email(message = "Invalid email format") @Size(max = 120, message = "Email can be at most 120 characters") String email,

        @Size(max = 20, message = "Phone number can be at most 20 characters") String phone,

        @Size(max = 40, message = "Status can be at most 40 characters") String status) {
}
