package com.calzone.financial.payment;

import com.calzone.financial.payment.dto.OrderDtos.CreateOrderRequest;
import com.calzone.financial.payment.dto.OrderDtos.CreateOrderResponse;
import com.calzone.financial.system.SystemConfig;
import com.calzone.financial.system.SystemConfigRepository;
import com.calzone.financial.user.User;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository repo;
    private final SystemConfigRepository configRepo;

    @Value("${razorpay.key_id:}")
    private String defaultKeyId;

    @Value("${razorpay.key_secret:}")
    private String defaultKeySecret;

    public PaymentService(PaymentRepository repo, SystemConfigRepository configRepo) {
        this.repo = repo;
        this.configRepo = configRepo;
    }

    private RazorpayClient getClient() throws Exception {
        String kId = getKeyId();
        String kSecret = getKeySecret();
        if (kId == null || kId.isBlank() || kSecret == null || kSecret.isBlank()) {
            throw new IllegalStateException("Razorpay keys not configured in Database or Properties");
        }
        return new RazorpayClient(kId, kSecret);
    }

    public String getKeyId() {
        return configRepo.findById("RAZORPAY_KEY_ID")
                .map(SystemConfig::getConfigValue)
                .orElse(defaultKeyId);
    }

    private String getKeySecret() {
        return configRepo.findById("RAZORPAY_KEY_SECRET")
                .map(SystemConfig::getConfigValue)
                .orElse(defaultKeySecret);
    }

    public CreateOrderResponse createOrder(CreateOrderRequest req, User user) throws Exception {
        RazorpayClient razorpayClient = getClient();
        JSONObject options = new JSONObject();
        options.put("amount", req.amount);
        options.put("currency", req.currency);
        if (req.description != null && !req.description.isBlank()) {
            options.put("receipt", req.description.substring(0, Math.min(40, req.description.length())));
            options.put("notes", new JSONObject().put("description", req.description));
        }
        Order order = razorpayClient.orders.create(options);

        Payment p = new Payment();
        p.setOrderId(order.get("id").toString());
        p.setStatus(order.get("status").toString());
        // Safely get amount as Long
        Object amtObj = order.get("amount");
        if (amtObj instanceof Number) {
            p.setAmount(((Number) amtObj).longValue());
        } else {
            p.setAmount(Long.parseLong(amtObj.toString()));
        }
        
        p.setCurrency(order.get("currency").toString());
        p.setDescription(req.description);
        p.setUser(user);
        repo.save(p);

        CreateOrderResponse res = new CreateOrderResponse();
        res.orderId = order.get("id").toString();
        res.keyId = getKeyId();
        if (amtObj instanceof Number) {
            res.amount = ((Number) amtObj).longValue();
        } else {
            res.amount = Long.parseLong(amtObj.toString());
        }
        res.currency = order.get("currency").toString();
        res.status = order.get("status").toString();
        res.description = req.description;
        return res;
    }

    public void markPaid(String orderId, String paymentId) {
        Optional<Payment> opt = repo.findByOrderId(orderId);
        opt.ifPresent(p -> { p.setPaymentId(paymentId); p.setStatus("paid"); repo.save(p); });
    }
}
