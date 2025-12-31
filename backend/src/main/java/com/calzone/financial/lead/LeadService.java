package com.calzone.financial.lead;

import com.calzone.financial.lead.dto.LeadRequest;
import com.calzone.financial.lead.dto.LeadResponse;
import com.calzone.financial.lead.dto.LeadUpdateRequest;
import com.calzone.financial.order.Order;
import com.calzone.financial.order.OrderRepository;
import com.calzone.financial.user.User;
import com.calzone.financial.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LeadService {

    private static final Logger log = LoggerFactory.getLogger(LeadService.class);

    @Value("${spring.mail.username}")
    private String adminEmail;

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final JavaMailSender mailSender;

    public LeadService(LeadRepository leadRepository, UserRepository userRepository,
            OrderRepository orderRepository, JavaMailSender mailSender) {
        this.leadRepository = leadRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.mailSender = mailSender;
    }

    @Transactional(readOnly = true)
    public List<LeadResponse> findAll(User owner) {
        boolean isAdmin = owner.getRoles().stream()
                .anyMatch(role -> role.getName().equalsIgnoreCase("ADMIN"));

        List<LeadResponse> responses = new ArrayList<>();

        // 1. Get Manual Leads
        List<Lead> leads;
        if (isAdmin) {
            leads = leadRepository.findAllByOrderByCreatedAtDesc();
        } else {
            // For employees: show all leads (not just assigned to them)
            leads = leadRepository.findAllByOrderByCreatedAtDesc();
        }
        responses.addAll(leads.stream().map(this::toResponse).toList());

        // 2. Get Users without Orders (For both Admin and Employees)
        List<User> allUsers = userRepository.findAll();
        // Get user IDs who have orders
        Set<Long> userIdsWithOrders = orderRepository.findAll().stream()
                .filter(o -> o.getUserId() != null)
                .map(Order::getUserId)
                .collect(Collectors.toSet());

        // Also check by email for orders without userId
        Set<String> emailsWithOrders = orderRepository.findAll().stream()
                .filter(o -> o.getCustomerEmail() != null)
                .map(Order::getCustomerEmail)
                .collect(Collectors.toSet());

        List<LeadResponse> userLeads = allUsers.stream()
                .filter(u -> !userIdsWithOrders.contains(u.getId()))
                .filter(u -> !emailsWithOrders.contains(u.getEmail()))
                // Filter out users who already have a Lead entry to avoid duplicates (by email)
                .filter(u -> leads.stream()
                        .noneMatch(l -> l.getEmail() != null && l.getEmail().equalsIgnoreCase(u.getEmail())))
                .map(u -> new LeadResponse(
                        u.getId(), // Use User ID (might overlap with Lead ID, but okay for display)
                        u.getFullName(),
                        u.getEmail(),
                        u.getPhone(),
                        "Signup", // Service
                        "New", // Status
                        "System", // Owner
                        u.getCreatedAt() != null ? u.getCreatedAt() : Instant.now(),
                        u.getUpdatedAt() != null ? u.getUpdatedAt() : Instant.now()))
                .toList();
        responses.addAll(userLeads);

        // Sort by created at desc
        responses.sort((r1, r2) -> r2.createdAt().compareTo(r1.createdAt()));

        return responses;
    }

    @Transactional(readOnly = true)
    public LeadResponse findById(Long id, User owner) {
        // Allow all authenticated users to view any lead
        return leadRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lead not found"));
    }

    @Transactional
    public LeadResponse create(LeadRequest request, User owner) {
        Lead lead = new Lead();
        lead.setName(request.name().trim());
        lead.setEmail(request.email() != null ? request.email().trim() : null);
        lead.setPhone(request.phone() != null ? request.phone().trim() : null);
        lead.setService(request.service() == null ? null : request.service().trim());
        lead.setStatus(normalizeStatus(request.status()));
        lead.setOwner(owner);
        Lead saved = leadRepository.save(lead);

        // Send email notification to admin asynchronously (best effort)
        try {
            sendEmailToAdmin(saved);
        } catch (Exception e) {
            // Log error but don't fail the request
            log.error("Failed to send lead notification email", e);
        }

        return toResponse(saved);
    }

    @Transactional
    public LeadResponse update(Long id, LeadUpdateRequest request, User owner) {
        // Allow all authenticated users to update any lead
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lead not found"));

        if (!request.isEmpty()) {
            if (request.name() != null && !request.name().isBlank()) {
                lead.setName(request.name().trim());
            }
            if (request.email() != null && !request.email().isBlank()) {
                lead.setEmail(request.email().trim());
            }
            if (request.phone() != null && !request.phone().isBlank()) {
                lead.setPhone(request.phone().trim());
            }
            if (request.service() != null) {
                lead.setService(request.service().isBlank() ? null : request.service().trim());
            }
            if (request.status() != null && !request.status().isBlank()) {
                lead.setStatus(normalizeStatus(request.status()));
            }
        }

        return toResponse(lead);
    }

    @Transactional
    public void delete(Long id, User owner) {
        // Allow all authenticated users to delete any lead
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lead not found"));
        leadRepository.delete(lead);
    }

    private LeadResponse toResponse(Lead lead) {
        return new LeadResponse(
                lead.getId(),
                lead.getName(),
                lead.getEmail(),
                lead.getPhone(),
                lead.getService(),
                lead.getStatus(),
                lead.getOwner() != null ? lead.getOwner().getFullName() : "Unknown",
                lead.getCreatedAt(),
                lead.getUpdatedAt());
    }

    private String normalizeStatus(String status) {
        return status != null ? status.trim() : "New";
    }

    private void sendEmailToAdmin(Lead lead) {
        if (adminEmail == null || adminEmail.isBlank()) {
            log.warn("Admin email not configured, skipping lead notification.");
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(adminEmail);
        message.setTo(adminEmail);
        message.setSubject("New Lead: " + lead.getName());

        StringBuilder customMessage = new StringBuilder();
        customMessage.append("New Lead Received!\n\n");
        customMessage.append("Details:\n");
        customMessage.append("Name: ").append(lead.getName()).append("\n");
        customMessage.append("Email: ").append(lead.getEmail() != null ? lead.getEmail() : "N/A").append("\n");
        customMessage.append("Phone: ").append(lead.getPhone() != null ? lead.getPhone() : "N/A").append("\n");
        customMessage.append("Service: ").append(lead.getService() != null ? lead.getService() : "N/A").append("\n");
        customMessage.append("Status: ").append(lead.getStatus()).append("\n");
        customMessage.append("Date: ").append(lead.getCreatedAt()).append("\n");

        message.setText(customMessage.toString());

        mailSender.send(message);
        log.info("Lead notification email sent to {}", adminEmail);
    }
}
