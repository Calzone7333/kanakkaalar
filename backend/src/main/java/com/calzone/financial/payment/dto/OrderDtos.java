package com.calzone.financial.payment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class OrderDtos {
    public static class CreateOrderRequest {
        @Min(1)
        public long amount; // in paise
        @NotBlank
        public String currency = "INR";
        public String description;
    }
    public static class CreateOrderResponse {
        public String orderId;
        public String keyId;
        public long amount;
        public String currency;
        public String status;
        public String description;
    }
}
