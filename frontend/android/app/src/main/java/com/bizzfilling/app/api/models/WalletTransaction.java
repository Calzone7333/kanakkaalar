package com.bizzfilling.app.api.models;

public class WalletTransaction {
    private int id;
    private double amount;
    private String type; // CREDIT, DEBIT
    private String description;
    private String createdAt;

    public int getId() {
        return id;
    }

    public double getAmount() {
        return amount;
    }

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public String getCreatedAt() {
        return createdAt;
    }
}
