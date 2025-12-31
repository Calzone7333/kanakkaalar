package com.calzone.financial.order;

import com.calzone.financial.user.User;
import com.calzone.financial.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final com.calzone.financial.wallet.WalletService walletService;
    private final com.calzone.financial.lead.LeadRepository leadRepository;

    public OrderController(OrderRepository orderRepository, DocumentRepository documentRepository,
            UserRepository userRepository, com.calzone.financial.wallet.WalletService walletService,
            com.calzone.financial.lead.LeadRepository leadRepository) {
        this.orderRepository = orderRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.leadRepository = leadRepository;
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Map<String, Object> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        Object principal = authentication.getPrincipal();
        String currentUserName = null;
        Long currentUserId = null;

        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            currentUserName = userDetails.getUsername();
            if (userDetails instanceof User) {
                currentUserId = ((User) userDetails).getId();
            }
        } else if (principal instanceof String) {
            currentUserName = (String) principal;
            // try to resolve to full user record
            Optional<User> uopt = userRepository.findByEmail(currentUserName);
            if (uopt.isPresent())
                currentUserId = uopt.get().getId();
        }

        Order o = new Order();
        o.setServiceName(String.valueOf(body.getOrDefault("serviceName", "Unknown Service")));
        if (currentUserName != null)
            o.setCustomerEmail(currentUserName);
        if (currentUserId != null)
            o.setUserId(currentUserId);
        if (body.containsKey("totalAmount")) {
            try {
                Object val = body.get("totalAmount");
                if (val instanceof Number) {
                    o.setTotalAmount(((Number) val).doubleValue());
                } else {
                    o.setTotalAmount(Double.parseDouble(String.valueOf(val)));
                }
            } catch (Exception ignored) {
            }
        }
        Order saved = orderRepository.save(o);

        // Delete lead if exists (converted to customer)
        if (o.getCustomerEmail() != null) {
            try {
                leadRepository.findByEmail(o.getCustomerEmail()).ifPresent(leadRepository::delete);
            } catch (Exception e) {
                // Ignore error during lead deletion
            }
        }

        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Order>> list() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> listMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        Object principal = authentication.getPrincipal();
        String username = null;
        Long userId = null;

        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            username = userDetails.getUsername();
            if (userDetails instanceof User) {
                userId = ((User) userDetails).getId();
            } else {
                // attempt to resolve full user from repository
                Optional<User> uopt = userRepository.findByEmail(username);
                if (uopt.isPresent())
                    userId = uopt.get().getId();
            }
        } else if (principal instanceof String) {
            username = (String) principal;
            Optional<User> uopt = userRepository.findByEmail(username);
            if (uopt.isPresent())
                userId = uopt.get().getId();
        }

        List<Order> orders = null;
        if (userId != null) {
            orders = orderRepository.findByUserId(userId);
        }

        if (orders == null || orders.isEmpty()) {
            // Fallback: try to find by customer email in case userId wasn't set on historic
            // orders
            if (username != null) {
                orders = orderRepository.findByCustomerEmail(username);
            } else {
                orders = java.util.Collections.emptyList();
            }
        }
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<Order>> listAssigned(@RequestParam(required = false) String assigneeEmail) {
        System.out.println("OrderController: listAssigned called with email: " + assigneeEmail);
        if (assigneeEmail == null || assigneeEmail.trim().isEmpty()) {
            List<Order> allAssigned = orderRepository.findByAssigneeEmailNotNull();
            System.out.println("OrderController: Returning all assigned orders, count: " + allAssigned.size());
            return ResponseEntity.ok(allAssigned);
        }
        List<Order> orders = orderRepository.findByAssigneeEmailIgnoreCase(assigneeEmail);
        System.out.println("OrderController: Found " + orders.size() + " orders for " + assigneeEmail);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> get(@PathVariable Long id) {
        return orderRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return orderRepository.findById(id).map(o -> {
            if (body.containsKey("status"))
                o.setStatus(body.get("status"));
            if (body.containsKey("assigneeEmail"))
                o.setAssigneeEmail(body.get("assigneeEmail"));
            Order saved = orderRepository.save(o);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Documents ---
    @PostMapping(path = "/{id}/documents", consumes = { "multipart/form-data" })
    public ResponseEntity<Document> addDocument(@PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        Optional<Order> o = orderRepository.findById(id);
        if (o.isEmpty())
            return ResponseEntity.notFound().build();
        Document d = new Document();
        d.setOrderId(id);
        d.setFileName(file.getOriginalFilename());
        d.setContent(file.getBytes());
        d.setContentType(file.getContentType());
        d.setSize(file.getSize());
        Document saved = documentRepository.save(d);
        // Mark order status to DOCUMENTS_PENDING
        Order order = o.get();
        order.setStatus("DOCUMENTS_PENDING");
        orderRepository.save(order);
        // Return metadata only (content not necessary in response) — but saved entity
        // contains it.
        saved.setContent(null);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<Map<String, Object>>> listDocuments(@PathVariable Long id) {
        List<Document> docs = documentRepository.findByOrderId(id);
        // Return metadata only to avoid large payloads
        List<Map<String, Object>> meta = new java.util.ArrayList<>();
        for (Document d : docs) {
            java.util.Map<String, Object> m = new java.util.HashMap<>();
            m.put("id", d.getId());
            m.put("fileName", d.getFileName());
            m.put("verified", d.getVerified());
            m.put("size", d.getSize());
            m.put("contentType", d.getContentType());
            m.put("uploadedAt", d.getUploadedAt());
            meta.add(m);
        }
        return ResponseEntity.ok(meta);
    }

    @GetMapping("/{id}/documents/{docId}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id, @PathVariable Long docId) {
        Optional<Document> d = documentRepository.findById(docId);
        if (d.isEmpty() || !d.get().getOrderId().equals(id))
            return ResponseEntity.notFound().build();
        Document doc = d.get();
        byte[] content = doc.getContent();
        if (content == null)
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + doc.getFileName() + "\"")
                .header("Content-Type",
                        doc.getContentType() == null ? "application/octet-stream" : doc.getContentType())
                .body(content);
    }

    @PostMapping("/{id}/documents/{docId}/verify")
    public ResponseEntity<Document> verifyDocument(@PathVariable Long id, @PathVariable Long docId) {
        Optional<Document> d = documentRepository.findById(docId);
        if (d.isEmpty() || !d.get().getOrderId().equals(id))
            return ResponseEntity.notFound().build();
        Document doc = d.get();
        doc.setVerified(true);
        documentRepository.save(doc);
        // If all docs verified mark order VERIFIED
        List<Document> docs = documentRepository.findByOrderId(id);
        boolean allVerified = docs.stream().allMatch(docItem -> Boolean.TRUE.equals(docItem.getVerified()));
        if (allVerified) {
            orderRepository.findById(id).ifPresent(order -> {
                order.setStatus("DOCUMENTS_VERIFIED");
                orderRepository.save(order);
            });
        }
        return ResponseEntity.ok(doc);
    }

    // --- Payment (mock) ---
    @PostMapping("/{id}/pay")
    public ResponseEntity<Map<String, Object>> pay(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<Order> o = orderRepository.findById(id);
        if (o.isEmpty())
            return ResponseEntity.notFound().build();
        Order order = o.get();
        // mock payment success
        order.setStatus("PAYMENT_COMPLETED");
        if (body.containsKey("paymentId"))
            order.setPaymentId(String.valueOf(body.get("paymentId")));
        orderRepository.save(order);

        // Commission Logic
        if (order.getUserId() != null) {
            userRepository.findById(order.getUserId()).ifPresent(user -> {
                boolean isAgent = user.getRoles().stream()
                        .anyMatch(role -> role.getName().equalsIgnoreCase("AGENT"));

                if (isAgent && order.getTotalAmount() > 0) {
                    java.math.BigDecimal commission = java.math.BigDecimal.valueOf(order.getTotalAmount())
                            .multiply(new java.math.BigDecimal("0.10")); // 10% commission

                    walletService.credit(user.getId(), commission, "Commission for Order #" + order.getId());
                }
            });
        }

        return ResponseEntity.ok(Map.of("message", "Payment processed", "orderId", order.getId()));
    }

    // --- Assign to employee (admin) ---
    @PostMapping("/{id}/assign")
    public ResponseEntity<Order> assign(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String assignee = body.get("assigneeEmail");
        if (assignee == null)
            return ResponseEntity.badRequest().build();
        return orderRepository.findById(id).map(order -> {
            order.setAssigneeEmail(assignee);
            order.setStatus("ASSIGNED");
            orderRepository.save(order);
            return ResponseEntity.ok(order);
        }).orElse(ResponseEntity.notFound().build());
    }
}
