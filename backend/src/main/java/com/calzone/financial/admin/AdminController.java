package com.calzone.financial.admin;

import com.calzone.financial.user.User;
import com.calzone.financial.user.UserRepository;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.calzone.financial.lead.dto.LeadResponse;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST,
        RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS })
public class AdminController {
    private final UserRepository users;
    private final AdminService adminService;

    public AdminController(UserRepository users, AdminService adminService) {
        this.users = users;
        this.adminService = adminService;
    }

    public record EmployeeDto(Long id, String fullName, String email, String phone, java.util.List<String> roles,
            String role, String address, boolean hasProfileImage) {
    }

    private static EmployeeDto toDto(User u) {
        java.util.List<String> roleNames = u.getRoles() == null ? java.util.List.of()
                : u.getRoles().stream().map(r -> r.getName()).toList();
        String primaryRole = roleNames.isEmpty() ? "USER" : roleNames.get(0);
        return new EmployeeDto(u.getId(), u.getFullName(), u.getEmail(), u.getPhone(), roleNames, primaryRole,
                u.getAddress(), u.hasProfileImage());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/employees")
    public ResponseEntity<?> createEmployee(
            @RequestParam("email") @Email String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "mobile", required = false) String mobile,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam("fullName") @NotBlank String fullName,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImageFile) {
        try {
            String phoneVal = phone != null && !phone.isBlank() ? phone : (mobile != null ? mobile : "");
            User createdUser = adminService.createEmployee(email, fullName, phoneVal, password, role, address,
                    profileImageFile);
            return ResponseEntity.ok(Map.of("id", createdUser.getId()));
        } catch (java.io.IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to process image file."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/employees")
    public ResponseEntity<Map<String, Object>> listEmployees() {
        java.util.List<EmployeeDto> employees = adminService.listEmployees().stream()
                .map(AdminController::toDto)
                .toList();
        Map<String, Object> stats = adminService.getEmployeeStats();

        Map<String, Object> response = new HashMap<>();
        response.put("employees", employees);
        response.put("stats", stats);

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/crm-leads")
    public ResponseEntity<java.util.List<LeadResponse>> listCrmLeads(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user) {
        return ResponseEntity.ok(adminService.listCrmLeads(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/leads")
    public java.util.List<EmployeeDto> listLeads() {
        return adminService.listLeads().stream()
                .map(AdminController::toDto)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/customer-lifecycle")
    public ResponseEntity<Map<String, Object>> getCustomerLifecycleData() {
        return ResponseEntity.ok(adminService.getCustomerLifecycleData());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/employees/{id}")
    public ResponseEntity<EmployeeDto> getEmployee(@PathVariable Long id) {
        return users.findById(id).map(u -> ResponseEntity.ok(toDto(u))).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/employees/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable Long id,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "mobile", required = false) String mobile,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImageFile) {
        try {
            String phoneVal = phone != null ? phone : mobile;
            User updatedUser = adminService.updateEmployee(id, fullName, phoneVal, password, role, address,
                    profileImageFile);
            return ResponseEntity.ok(Map.of("id", updatedUser.getId()));
        } catch (java.io.IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to process image file."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/employees/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        adminService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/leads/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        adminService.deleteEmployee(id); // Re-using the same service method which deletes a user by ID
        return ResponseEntity.noContent().build();
    }

    // --- Agent Management Endpoints ---

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/agents")
    public ResponseEntity<Map<String, Object>> listAgents() {
        java.util.List<EmployeeDto> agents = adminService.listAgents().stream()
                .map(AdminController::toDto)
                .toList();
        Map<String, Object> stats = adminService.getAgentStats();

        Map<String, Object> response = new HashMap<>();
        response.put("agents", agents);
        response.put("stats", stats);

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/agents")
    public ResponseEntity<?> createAgent(
            @RequestParam("email") @Email String email,
            @RequestParam("fullName") @NotBlank String fullName,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "aadhaarNumber", required = false) String aadhaarNumber,
            @RequestParam(value = "panNumber", required = false) String panNumber,
            @RequestParam(value = "firmName", required = false) String firmName,
            @RequestParam(value = "referralCode", required = false) String referralCode,
            @RequestParam(value = "bankHolderName", required = false) String bankHolderName,
            @RequestParam(value = "bankAccountNumber", required = false) String bankAccountNumber,
            @RequestParam(value = "bankIfsc", required = false) String bankIfsc,
            @RequestParam(value = "bankName", required = false) String bankName,
            @RequestParam(value = "aadhaarFront", required = false) MultipartFile aadhaarFront,
            @RequestParam(value = "aadhaarBack", required = false) MultipartFile aadhaarBack,
            @RequestParam(value = "panCard", required = false) MultipartFile panCard) {
        try {
            User createdAgent = adminService.createAgent(
                    email, fullName, password, phone, address, state, city,
                    aadhaarNumber, panNumber, firmName, referralCode,
                    bankHolderName, bankAccountNumber, bankIfsc, bankName,
                    aadhaarFront, aadhaarBack, panCard);
            return ResponseEntity.ok(Map.of("id", createdAgent.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/agents/{id}")
    public ResponseEntity<?> updateAgent(
            @PathVariable Long id,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "aadhaarNumber", required = false) String aadhaarNumber,
            @RequestParam(value = "panNumber", required = false) String panNumber,
            @RequestParam(value = "firmName", required = false) String firmName,
            @RequestParam(value = "referralCode", required = false) String referralCode,
            @RequestParam(value = "bankHolderName", required = false) String bankHolderName,
            @RequestParam(value = "bankAccountNumber", required = false) String bankAccountNumber,
            @RequestParam(value = "bankIfsc", required = false) String bankIfsc,
            @RequestParam(value = "bankName", required = false) String bankName,
            @RequestParam(value = "aadhaarFront", required = false) MultipartFile aadhaarFront,
            @RequestParam(value = "aadhaarBack", required = false) MultipartFile aadhaarBack,
            @RequestParam(value = "panCard", required = false) MultipartFile panCard) {
        try {
            User updatedAgent = adminService.updateAgent(
                    id, fullName, email, phone, address, state, city,
                    aadhaarNumber, panNumber, firmName, referralCode,
                    bankHolderName, bankAccountNumber, bankIfsc, bankName,
                    aadhaarFront, aadhaarBack, panCard);
            return ResponseEntity.ok(Map.of("id", updatedAgent.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/agents/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable Long id) {
        adminService.deleteAgent(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/agents/{id}/status")
    public ResponseEntity<?> toggleAgentStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            adminService.toggleAgentStatus(id, payload.get("status"));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
