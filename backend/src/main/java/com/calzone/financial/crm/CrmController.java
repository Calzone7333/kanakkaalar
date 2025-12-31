package com.calzone.financial.crm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crm")
public class CrmController {

    @Autowired
    private CrmService crmService;

    // ==================== Customer Profile Endpoints ====================
    
    @PostMapping("/customer-profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> createCustomerProfile(
            @RequestBody Map<String, Object> profileData,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            CustomerProfile profile = crmService.createCustomerProfile(userId, profileData);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/customer-profile/me")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            CustomerProfile profile = crmService.getCustomerProfileByUserId(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/customer-profiles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllCustomerProfiles() {
        List<CustomerProfile> profiles = crmService.getAllCustomerProfiles();
        return ResponseEntity.ok(profiles);
    }

    @PutMapping("/customer-profile/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> updateCustomerProfile(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            CustomerProfile profile = crmService.updateCustomerProfile(id, updates);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== Service Request Endpoints ====================
    
    @PostMapping("/service-request")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> createServiceRequest(@RequestBody Map<String, Object> requestData) {
        try {
            Long customerProfileId = Long.parseLong(requestData.get("customerProfileId").toString());
            B2CServiceRequest request = crmService.createServiceRequest(customerProfileId, requestData);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/service-requests/customer/{customerProfileId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getServiceRequestsByCustomer(@PathVariable Long customerProfileId) {
        List<B2CServiceRequest> requests = crmService.getServiceRequestsByCustomer(customerProfileId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/service-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllServiceRequests() {
        List<B2CServiceRequest> requests = crmService.getAllServiceRequests();
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/service-request/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateServiceRequest(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            B2CServiceRequest request = crmService.updateServiceRequest(id, updates);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== Document Endpoints ====================
    
    @PostMapping("/document")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> uploadDocument(@RequestBody Map<String, Object> documentData) {
        try {
            Long customerProfileId = Long.parseLong(documentData.get("customerProfileId").toString());
            CustomerDocument document = crmService.uploadDocument(customerProfileId, documentData);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/documents/customer/{customerProfileId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getDocumentsByCustomer(@PathVariable Long customerProfileId) {
        List<CustomerDocument> documents = crmService.getDocumentsByCustomer(customerProfileId);
        return ResponseEntity.ok(documents);
    }

    @DeleteMapping("/document/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        try {
            crmService.deleteDocument(id);
            return ResponseEntity.ok(Map.of("message", "Document deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== Support Ticket Endpoints ====================
    
    @PostMapping("/support-ticket")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> createSupportTicket(@RequestBody Map<String, Object> ticketData) {
        try {
            Long customerProfileId = Long.parseLong(ticketData.get("customerProfileId").toString());
            SupportTicket ticket = crmService.createSupportTicket(customerProfileId, ticketData);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/support-tickets/customer/{customerProfileId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getTicketsByCustomer(@PathVariable Long customerProfileId) {
        List<SupportTicket> tickets = crmService.getTicketsByCustomer(customerProfileId);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/support-tickets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllTickets() {
        List<SupportTicket> tickets = crmService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    @PutMapping("/support-ticket/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTicketStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            SupportTicket ticket = crmService.updateTicketStatus(id, statusUpdate.get("status"));
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== Wallet Endpoints ====================
    
    @GetMapping("/wallet/customer/{customerProfileId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getWallet(@PathVariable Long customerProfileId) {
        CustomerWallet wallet = crmService.getWalletByCustomer(customerProfileId);
        return ResponseEntity.ok(wallet);
    }

    @PostMapping("/wallet/add-money")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> addMoney(@RequestBody Map<String, Object> data) {
        try {
            Long customerProfileId = Long.parseLong(data.get("customerProfileId").toString());
            BigDecimal amount = new BigDecimal(data.get("amount").toString());
            String description = (String) data.get("description");
            
            WalletTransaction transaction = crmService.addMoneyToWallet(customerProfileId, amount, description);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/wallet/deduct")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deductMoney(@RequestBody Map<String, Object> data) {
        try {
            Long customerProfileId = Long.parseLong(data.get("customerProfileId").toString());
            BigDecimal amount = new BigDecimal(data.get("amount").toString());
            String description = (String) data.get("description");
            String referenceId = (String) data.get("referenceId");
            
            WalletTransaction transaction = crmService.deductFromWallet(customerProfileId, amount, description, referenceId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/wallet/{walletId}/transactions")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getWalletTransactions(@PathVariable Long walletId) {
        List<WalletTransaction> transactions = crmService.getWalletTransactions(walletId);
        return ResponseEntity.ok(transactions);
    }

    // ==================== Dashboard Stats ====================
    
    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = crmService.getCrmDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
