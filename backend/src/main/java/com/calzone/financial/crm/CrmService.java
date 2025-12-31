package com.calzone.financial.crm;

import com.calzone.financial.user.User;
import com.calzone.financial.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class CrmService {

    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    @Autowired
    private B2CServiceRequestRepository serviceRequestRepository;

    @Autowired
    private CustomerDocumentRepository documentRepository;

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Autowired
    private CustomerWalletRepository walletRepository;

    @Autowired
    private WalletTransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    // ==================== Customer Profile ====================
    
    @Transactional
    public CustomerProfile createCustomerProfile(Long userId, Map<String, Object> profileData) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        CustomerProfile profile = new CustomerProfile();
        profile.setUser(user);
        
        if (profileData.containsKey("whatsappNumber")) {
            profile.setWhatsappNumber((String) profileData.get("whatsappNumber"));
        }
        if (profileData.containsKey("dateOfBirth")) {
            profile.setDateOfBirth(LocalDate.parse((String) profileData.get("dateOfBirth")));
        }
        if (profileData.containsKey("gender")) {
            profile.setGender((String) profileData.get("gender"));
        }
        
        CustomerProfile savedProfile = customerProfileRepository.save(profile);
        
        // Create wallet for customer
        CustomerWallet wallet = new CustomerWallet();
        wallet.setCustomerProfile(savedProfile);
        walletRepository.save(wallet);
        
        return savedProfile;
    }

    public CustomerProfile getCustomerProfileByUserId(Long userId) {
        return customerProfileRepository.findByUserId(userId)
            .orElse(null);
    }

    public List<CustomerProfile> getAllCustomerProfiles() {
        return customerProfileRepository.findAll();
    }

    @Transactional
    public CustomerProfile updateCustomerProfile(Long profileId, Map<String, Object> updates) {
        CustomerProfile profile = customerProfileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (updates.containsKey("whatsappNumber")) {
            profile.setWhatsappNumber((String) updates.get("whatsappNumber"));
        }
        if (updates.containsKey("dateOfBirth")) {
            profile.setDateOfBirth(LocalDate.parse((String) updates.get("dateOfBirth")));
        }
        if (updates.containsKey("gender")) {
            profile.setGender((String) updates.get("gender"));
        }
        if (updates.containsKey("aadhaarNumber")) {
            profile.setAadhaarNumber((String) updates.get("aadhaarNumber"));
        }
        if (updates.containsKey("panNumber")) {
            profile.setPanNumber((String) updates.get("panNumber"));
        }
        if (updates.containsKey("status")) {
            profile.setStatus((String) updates.get("status"));
        }
        if (updates.containsKey("kycStatus")) {
            profile.setKycStatus((String) updates.get("kycStatus"));
        }

        return customerProfileRepository.save(profile);
    }

    // ==================== Service Requests ====================
    
    @Transactional
    public B2CServiceRequest createServiceRequest(Long customerProfileId, Map<String, Object> requestData) {
        CustomerProfile profile = customerProfileRepository.findById(customerProfileId)
            .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        B2CServiceRequest request = new B2CServiceRequest();
        request.setCustomerProfile(profile);
        request.setServiceName((String) requestData.get("serviceName"));
        
        if (requestData.containsKey("assignedStaff")) {
            request.setAssignedStaff((String) requestData.get("assignedStaff"));
        }
        if (requestData.containsKey("deadline")) {
            request.setDeadline(LocalDate.parse((String) requestData.get("deadline")));
        }
        if (requestData.containsKey("fees")) {
            request.setFees(new BigDecimal(requestData.get("fees").toString()));
        }

        return serviceRequestRepository.save(request);
    }

    public List<B2CServiceRequest> getServiceRequestsByCustomer(Long customerProfileId) {
        return serviceRequestRepository.findByCustomerProfileId(customerProfileId);
    }

    public List<B2CServiceRequest> getAllServiceRequests() {
        return serviceRequestRepository.findAll();
    }

    @Transactional
    public B2CServiceRequest updateServiceRequest(Long requestId, Map<String, Object> updates) {
        B2CServiceRequest request = serviceRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Service request not found"));

        if (updates.containsKey("status")) {
            request.setStatus((String) updates.get("status"));
        }
        if (updates.containsKey("assignedStaff")) {
            request.setAssignedStaff((String) updates.get("assignedStaff"));
        }
        if (updates.containsKey("paymentStatus")) {
            request.setPaymentStatus((String) updates.get("paymentStatus"));
        }

        return serviceRequestRepository.save(request);
    }

    // ==================== Documents ====================
    
    @Transactional
    public CustomerDocument uploadDocument(Long customerProfileId, Map<String, Object> documentData) {
        CustomerProfile profile = customerProfileRepository.findById(customerProfileId)
            .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        CustomerDocument document = new CustomerDocument();
        document.setCustomerProfile(profile);
        document.setDocumentName((String) documentData.get("documentName"));
        document.setDocumentType((String) documentData.get("documentType"));
        document.setFileUrl((String) documentData.get("fileUrl"));
        
        if (documentData.containsKey("tags")) {
            document.setTags((String) documentData.get("tags"));
        }

        return documentRepository.save(document);
    }

    public List<CustomerDocument> getDocumentsByCustomer(Long customerProfileId) {
        return documentRepository.findByCustomerProfileId(customerProfileId);
    }

    @Transactional
    public void deleteDocument(Long documentId) {
        documentRepository.deleteById(documentId);
    }

    // ==================== Support Tickets ====================
    
    @Transactional
    public SupportTicket createSupportTicket(Long customerProfileId, Map<String, Object> ticketData) {
        CustomerProfile profile = customerProfileRepository.findById(customerProfileId)
            .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        SupportTicket ticket = new SupportTicket();
        ticket.setCustomerProfile(profile);
        ticket.setCategory((String) ticketData.get("category"));
        ticket.setPriority((String) ticketData.get("priority"));
        ticket.setSubject((String) ticketData.get("subject"));
        ticket.setDescription((String) ticketData.get("description"));

        return ticketRepository.save(ticket);
    }

    public List<SupportTicket> getTicketsByCustomer(Long customerProfileId) {
        return ticketRepository.findByCustomerProfileId(customerProfileId);
    }

    public List<SupportTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Transactional
    public SupportTicket updateTicketStatus(Long ticketId, String status) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    // ==================== Wallet ====================
    
    public CustomerWallet getWalletByCustomer(Long customerProfileId) {
        return walletRepository.findByCustomerProfileId(customerProfileId)
            .orElse(null);
    }

    @Transactional
    public WalletTransaction addMoneyToWallet(Long customerProfileId, BigDecimal amount, String description) {
        CustomerWallet wallet = walletRepository.findByCustomerProfileId(customerProfileId)
            .orElseThrow(() -> new RuntimeException("Wallet not found"));

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setTransactionType("CREDIT");
        transaction.setAmount(amount);
        transaction.setDescription(description);

        return transactionRepository.save(transaction);
    }

    @Transactional
    public WalletTransaction deductFromWallet(Long customerProfileId, BigDecimal amount, String description, String referenceId) {
        CustomerWallet wallet = walletRepository.findByCustomerProfileId(customerProfileId)
            .orElseThrow(() -> new RuntimeException("Wallet not found"));

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setTransactionType("DEBIT");
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setReferenceId(referenceId);

        return transactionRepository.save(transaction);
    }

    public List<WalletTransaction> getWalletTransactions(Long walletId) {
        return transactionRepository.findByWalletIdOrderByTransactionDateDesc(walletId);
    }

    // ==================== Dashboard Stats ====================
    
    public Map<String, Object> getCrmDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalCustomers = customerProfileRepository.count();
        long activeServices = serviceRequestRepository.findByStatus("In Progress").size();
        long pendingRequests = serviceRequestRepository.findByStatus("Pending").size();
        
        stats.put("totalCustomers", totalCustomers);
        stats.put("activeServices", activeServices);
        stats.put("pendingRequests", pendingRequests);
        
        return stats;
    }
}
