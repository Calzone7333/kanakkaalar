package com.bizzfilling.app.api.models;

public class CreateOrderRequest {
    private String serviceName;
    private String customerEmail;
    private double totalAmount;

    public CreateOrderRequest(String serviceName, String customerEmail, double totalAmount) {
        this.serviceName = serviceName;
        this.customerEmail = customerEmail;
        this.totalAmount = totalAmount;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
