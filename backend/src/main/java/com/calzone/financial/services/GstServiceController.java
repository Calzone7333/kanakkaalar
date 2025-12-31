package com.calzone.financial.services;

import com.calzone.financial.order.Order;
import com.calzone.financial.order.OrderRepository;
import com.calzone.financial.process.ProcessStage;
import com.calzone.financial.process.ProcessStageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/services/gst")
public class GstServiceController {

    private final OrderRepository orderRepository;
    private final ProcessStageRepository stageRepository;

    public GstServiceController(OrderRepository orderRepository, ProcessStageRepository stageRepository) {
        this.orderRepository = orderRepository;
        this.stageRepository = stageRepository;
    }

    public record GstRequest(String customerName, String customerEmail, String businessName, String pan, String phone, String address) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody GstRequest req) {
        // Create order
        Order o = new Order();
        o.setServiceName("GST Registration");
        o.setCustomerEmail(req.customerEmail() == null ? "" : req.customerEmail());
        o.setStatus("CREATED");
        // You may set a default price or calculate based on input
        o.setTotalAmount(999.0); // example fixed price
        Order saved = orderRepository.save(o);

        // Create initial process stages for GST flow
        List<ProcessStage> stages = new ArrayList<>();
        stages.add(new ProcessStage(saved.getId(), "WEB_SUBMISSION", "completed", "Application submitted by user"));
        stages.add(new ProcessStage(saved.getId(), "DOCUMENT_VERIFICATION", "pending", "Verify PAN, address, and identity docs"));
        stages.add(new ProcessStage(saved.getId(), "PORTAL_SUBMISSION", "pending", "Submit application on GST portal"));
        stages.add(new ProcessStage(saved.getId(), "PAYMENT", "pending", "GST registration fees / government fees"));
        stages.add(new ProcessStage(saved.getId(), "GSTIN_ISSUED", "pending", "GSTIN issuance awaiting confirmation"));

        List<ProcessStage> savedStages = stageRepository.saveAll(stages);

        return ResponseEntity.ok(java.util.Map.of("order", saved, "stages", savedStages));
    }
}
