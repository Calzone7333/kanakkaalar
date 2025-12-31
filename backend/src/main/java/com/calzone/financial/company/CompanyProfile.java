package com.calzone.financial.company;

import com.calzone.financial.user.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "company_profiles")
public class CompanyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    // Company Details
    @Column(nullable = false)
    private String businessName;

    @Column(nullable = false)
    private String businessType; // Sole Proprietorship, Private Limited, Partnership / LLP

    private LocalDate incorporationDate;

    @Column(columnDefinition = "TEXT")
    private String registeredAddress;

    // Compliance & Tax Setup
    private String gstin; // Optional if exempt
    private String gstUsername;
    private String tanNumber; // If applicable

    // Financial Initialization
    private String primaryBankName;
    private BigDecimal currentBalance;
    private String balanceSheetUrl; // File path or URL
    
    @Column(nullable = false)
    private String panNumber;

    public CompanyProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public String getBalanceSheetUrl() { return balanceSheetUrl; }
    public void setBalanceSheetUrl(String balanceSheetUrl) { this.balanceSheetUrl = balanceSheetUrl; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }
}
