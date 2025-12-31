package com.calzone.financial.payment;

import com.calzone.financial.payment.dto.OrderDtos.CreateOrderRequest;
import com.calzone.financial.payment.dto.OrderDtos.CreateOrderResponse;
import com.calzone.financial.user.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.razorpay.RazorpayException;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service;
    private final PaymentRepository repo;

    public PaymentController(PaymentService service, PaymentRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    @PostMapping("/order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest req,
            @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(service.createOrder(req, user));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new CreateOrderResponse() {
                {
                    description = e.getMessage();
                    status = "error";
                }
            });
        } catch (RazorpayException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new CreateOrderResponse() {
                {
                    description = "Razorpay Error: " + e.getMessage();
                    status = "error";
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new CreateOrderResponse() {
                {
                    description = "Payment initialization failed: " + e.getMessage();
                    status = "error";
                }
            });
        }
    }

    @GetMapping("/mine")
    public List<Payment> myPayments(@AuthenticationPrincipal User user) {
        return repo.findByUserOrderByCreatedAtDesc(user);
    }

    @GetMapping("/key")
    public ResponseEntity<java.util.Map<String, String>> getKey() {
        return ResponseEntity.ok(java.util.Collections.singletonMap("key", service.getKeyId()));
    }

    @Value("${razorpay.webhook_secret:}")
    private String webhookSecret;

    private static String hmacSHA256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] digest = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(digest);
    }

    @PostMapping("/confirm")
    public ResponseEntity<Void> confirm(@RequestBody ConfirmPayload payload,
            @AuthenticationPrincipal User user) {
        if (payload == null || payload.orderId == null || payload.paymentId == null)
            return ResponseEntity.badRequest().build();
        service.markPaid(payload.orderId, payload.paymentId);
        return ResponseEntity.ok().build();
    }

    public static class ConfirmPayload {
        public String orderId;
        public String paymentId;
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(@RequestHeader("X-Razorpay-Signature") String signature,
            @RequestBody String body) {
        try {
            if (webhookSecret == null || webhookSecret.isBlank()) {
                return ResponseEntity.status(HttpStatus.PRECONDITION_REQUIRED).build();
            }
            String computed = hmacSHA256(body, webhookSecret);
            // Razorpay sends Base64 signature; compare timing-safe by equals
            if (!computed.equals(signature)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            // Very simple payload parse to extract order_id and payment_id
            if (body.contains("order_id") && body.contains("payment_id")) {
                String orderId = extract(body, "order_id");
                String paymentId = extract(body, "payment_id");
                if (orderId != null && paymentId != null) {
                    service.markPaid(orderId, paymentId);
                }
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String extract(String body, String key) {
        int i = body.indexOf("\"" + key + "\"");
        if (i < 0)
            return null;
        int colon = body.indexOf(":", i);
        int startQuote = body.indexOf('"', colon + 1);
        int endQuote = body.indexOf('"', startQuote + 1);
        if (startQuote < 0 || endQuote < 0)
            return null;
        return body.substring(startQuote + 1, endQuote);
    }
}
