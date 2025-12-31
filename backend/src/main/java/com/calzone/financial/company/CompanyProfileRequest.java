package com.calzone.financial.company;

import java.time.LocalDate;
import java.math.BigDecimal;

public class CompanyProfileRequest {
    private String businessName;
    private String businessType;
    private LocalDate incorporationDate;
    private String registeredAddress;
    private String gstin;
    private String gstUsername;
    private String tanNumber;
    private String primaryBankName;
    private BigDecimal currentBalance;
    private String panNumber;
    // File upload will be handled separately or as a multipart request, 
    // but for the JSON body, we might just receive the URL if uploaded separately.
    // For now, let's assume the file is uploaded via a separate endpoint or multipart.

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }

    public LocalDate getIncorporationDate() { return incorporationDate; }
    public void setIncorporationDate(LocalDate incorporationDate) { this.incorporationDate = incorporationDate; }

    public String getRegisteredAddress() { return registeredAddress; }
    public void setRegisteredAddress(String registeredAddress) { this.registeredAddress = registeredAddress; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getGstUsername() { return gstUsername; }
    public void setGstUsername(String gstUsername) { this.gstUsername = gstUsername; }

    public String getTanNumber() { return tanNumber; }
    public void setTanNumber(String tanNumber) { this.tanNumber = tanNumber; }

    public String getPrimaryBankName() { return primaryBankName; }
    public void setPrimaryBankName(String primaryBankName) { this.primaryBankName = primaryBankName; }

    public BigDecimal getCurrentBalance() { return currentBalance; }
    public void setCurrentBalance(BigDecimal currentBalance) { this.currentBalance = currentBalance; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }
}
