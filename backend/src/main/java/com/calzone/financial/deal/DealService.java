package com.calzone.financial.deal;

import com.calzone.financial.deal.dto.DealRequest;
import com.calzone.financial.deal.dto.DealResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DealService {

    private final DealRepository dealRepository;
    private final com.calzone.financial.order.OrderRepository orderRepository;
    private final com.calzone.financial.user.UserRepository userRepository;

    public DealService(DealRepository dealRepository, com.calzone.financial.order.OrderRepository orderRepository, com.calzone.financial.user.UserRepository userRepository) {
        this.dealRepository = dealRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<DealResponse> getAllDeals() {
        List<DealResponse> manualDeals = dealRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
        
        List<DealResponse> orderDeals = orderRepository.findAll().stream()
                .map(order -> {
                    String custName = order.getCustomerEmail();
                    if (order.getUserId() != null) {
                         custName = userRepository.findById(order.getUserId())
                            .map(u -> u.getFullName() + " (" + u.getEmail() + ")")
                            .orElse(order.getCustomerEmail());
                    } else if (order.getCustomerEmail() != null) {
                         custName = userRepository.findByEmail(order.getCustomerEmail())
                            .map(u -> u.getFullName() + " (" + u.getEmail() + ")")
                            .orElse(order.getCustomerEmail());
                    }
                    
                    // Convert LocalDateTime to Instant
                    java.time.Instant createdInstant = order.getCreatedAt() != null 
                        ? order.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant()
                        : null;
                    
                    return new DealResponse(
                        order.getId(),
                        "Order: " + order.getServiceName(),
                        custName,
                        String.valueOf(order.getTotalAmount()),
                        order.getStatus(),
                        100, // Probability
                        order.getAssigneeEmail() != null ? order.getAssigneeEmail() : "System",
                        null, // Due date
                        createdInstant,
                        createdInstant // Fallback to createdAt since updatedAt is missing
                    );
                })
                .collect(java.util.stream.Collectors.toList());

        // Combine lists
        java.util.List<DealResponse> allDeals = new java.util.ArrayList<>();
        allDeals.addAll(manualDeals);
        allDeals.addAll(orderDeals);
        
        // Sort by created at desc
        allDeals.sort((d1, d2) -> {
             if (d1.createdAt() == null || d2.createdAt() == null) return 0;
             return d2.createdAt().compareTo(d1.createdAt());
        });
        
        return allDeals;
    }

    @Transactional
    public DealResponse createDeal(DealRequest request) {
        Deal deal = new Deal();
        deal.setName(request.name());
        deal.setCustomer(request.customer());
        deal.setAmount(request.amount());
        deal.setStage(request.stage());
        deal.setProbability(request.probability());
        deal.setOwner(request.owner());
        deal.setDueDate(request.dueDate());
        
        Deal savedDeal = dealRepository.save(deal);
        return toResponse(savedDeal);
    }

    @Transactional
    public DealResponse updateDeal(Long id, java.util.Map<String, Object> updates) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Deal not found with id: " + id));

        if (updates.containsKey("name")) deal.setName((String) updates.get("name"));
        if (updates.containsKey("customer")) deal.setCustomer((String) updates.get("customer"));
        if (updates.containsKey("amount")) deal.setAmount((String) updates.get("amount"));
        if (updates.containsKey("stage")) deal.setStage((String) updates.get("stage"));
        if (updates.containsKey("probability")) deal.setProbability((Integer) updates.get("probability"));
        if (updates.containsKey("owner")) deal.setOwner((String) updates.get("owner"));
        if (updates.containsKey("dueDate")) {
             // Handle date parsing if necessary, assuming string or LocalDate
             Object dateObj = updates.get("dueDate");
             if (dateObj instanceof String) {
                 deal.setDueDate(java.time.LocalDate.parse((String) dateObj));
             } else if (dateObj instanceof java.time.LocalDate) {
                 deal.setDueDate((java.time.LocalDate) dateObj);
             }
        }

        Deal savedDeal = dealRepository.save(deal);
        return toResponse(savedDeal);
    }

    private DealResponse toResponse(Deal deal) {
        return new DealResponse(
            deal.getId(),
            deal.getName(),
            deal.getCustomer(),
            deal.getAmount(),
            deal.getStage(),
            deal.getProbability(),
            deal.getOwner(),
            deal.getDueDate(),
            deal.getCreatedAt(),
            deal.getUpdatedAt()
        );
    }
}
