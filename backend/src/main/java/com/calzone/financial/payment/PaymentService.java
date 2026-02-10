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
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository repo;
    private final SystemConfigRepository configRepo;
    private final com.calzone.financial.deal.DealRepository dealRepo;
    private final com.calzone.financial.order.OrderRepository orderRepo;
    private final com.calzone.financial.lead.LeadRepository leadRepo;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String adminEmail;

    @Value("${razorpay.key_id:}")
    private String defaultKeyId;

    @Value("${razorpay.key_secret:}")
    private String defaultKeySecret;

    @Value("${twilio.account_sid:}")
    private String twilioSid;

    @Value("${twilio.auth_token:}")
    private String twilioToken;

    @Value("${twilio.phone_number:}")
    private String twilioPhone;

    public PaymentService(PaymentRepository repo, SystemConfigRepository configRepo,
            com.calzone.financial.deal.DealRepository dealRepo,
            com.calzone.financial.order.OrderRepository orderRepo,
            com.calzone.financial.lead.LeadRepository leadRepo,
            JavaMailSender mailSender) {
        this.repo = repo;
        this.configRepo = configRepo;
        this.dealRepo = dealRepo;
        this.orderRepo = orderRepo;
        this.leadRepo = leadRepo;
        this.mailSender = mailSender;
    }

    public String getKeyId() {
        Optional<String> dbValue = configRepo.findById("RAZORPAY_KEY_ID").map(SystemConfig::getConfigValue);
        if (dbValue.isPresent() && !dbValue.get().isBlank()) {
            return dbValue.get();
        }
        return defaultKeyId;
    }

    private String getKeySecret() {
        Optional<String> dbValue = configRepo.findById("RAZORPAY_KEY_SECRET").map(SystemConfig::getConfigValue);
        if (dbValue.isPresent() && !dbValue.get().isBlank()) {
            return dbValue.get();
        }
        return defaultKeySecret;
    }

    public CreateOrderResponse createOrder(CreateOrderRequest req, User user) throws Exception {
        String kId = getKeyId();
        String kSecret = getKeySecret();

        if (kId == null || kId.isBlank() || kSecret == null || kSecret.isBlank()) {
            log.error("CRITICAL: Razorpay keys are missing! Checked DB (system_configs) and application.properties.");
            throw new IllegalStateException("Payment provider not configured. Please contact support.");
        }

        log.info("Creating Razorpay order using Key ID: {}... (Source: {})",
                kId.substring(0, Math.min(kId.length(), 6)) + "****",
                configRepo.findById("RAZORPAY_KEY_ID").isPresent() ? "Database" : "Properties");

        RazorpayClient razorpayClient = new RazorpayClient(kId, kSecret);
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

        // Save customer info (important for guest users)
        p.setCustomerName(req.customerName);
        p.setCustomerEmail(req.customerEmail);
        p.setCustomerPhone(req.customerPhone);

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
        opt.ifPresent(p -> {
            p.setPaymentId(paymentId);
            p.setStatus("paid");
            repo.save(p);

            // Create Deal from payment
            try {
                com.calzone.financial.deal.Deal deal = new com.calzone.financial.deal.Deal();
                deal.setName(p.getDescription() != null ? p.getDescription() : "Order Payment " + orderId);

                if (p.getUser() != null) {
                    deal.setCustomer(p.getUser().getFullName() + " (" + p.getUser().getEmail() + ")");
                    deal.setOwner(p.getUser().getEmail());
                } else {
                    String customer = (p.getCustomerName() != null ? p.getCustomerName() : "Guest")
                            + " (" + (p.getCustomerEmail() != null ? p.getCustomerEmail() : "N/A") + ")";
                    deal.setCustomer(customer);
                    deal.setOwner("System");
                }

                // Razorpay amount is in smallest currency unit (paise), convert to main unit
                long mainAmount = p.getAmount() != null ? p.getAmount() / 100 : 0;
                deal.setAmount(String.valueOf(mainAmount));

                deal.setStage("Deal Won");
                deal.setProbability(100);
                deal.setDueDate(java.time.LocalDate.now().plusDays(7)); // Expect delivery/closure in 7 days

                dealRepo.save(deal);

                // --- Create Order (Operations) ---
                try {
                    com.calzone.financial.order.Order order = new com.calzone.financial.order.Order();
                    order.setServiceName(p.getDescription());
                    order.setCustomerEmail(p.getCustomerEmail() != null ? p.getCustomerEmail()
                            : (p.getUser() != null ? p.getUser().getEmail() : null));
                    order.setTotalAmount(p.getAmount() / 100.0);
                    order.setPaymentId(p.getPaymentId());
                    order.setStatus("PAID");
                    if (p.getUser() != null) {
                        order.setUserId(p.getUser().getId());
                    }
                    orderRepo.save(order);
                } catch (Exception e) {
                    log.error("Failed to create order record after payment", e);
                }

                // --- Remove from Leads ---
                try {
                    String emailPart = p.getCustomerEmail();
                    if (emailPart == null && p.getUser() != null) {
                        emailPart = p.getUser().getEmail();
                    }
                    final String emailToDelete = emailPart;

                    if (emailToDelete != null && !emailToDelete.isBlank()) {
                        log.info("Removing paid customer from Leads: {}", emailToDelete);
                        leadRepo.findByEmail(emailToDelete).ifPresent(lead -> {
                            leadRepo.delete(lead);
                            log.info("Deleted lead entry for: {}", emailToDelete);
                        });
                    }
                } catch (Exception e) {
                    log.error("Failed to remove lead after payment", e);
                }

                // Send Confirmation Emails
                sendPaymentSuccessEmails(p);

            } catch (Exception e) {
                log.error("Failed to process payment completion tasks for order " + orderId, e);
            }
        });
    }

    private void sendPaymentSuccessEmails(Payment p) {
        String customerEmail = p.getCustomerEmail();
        if (customerEmail == null && p.getUser() != null) {
            customerEmail = p.getUser().getEmail();
        }

        if (customerEmail != null && !customerEmail.isBlank()) {
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

                helper.setFrom(adminEmail, "Kanakkaalar");
                helper.setTo(customerEmail);
                helper.setSubject("Payment Successful! - Welcome to Kanakkaalar");

                long amount = p.getAmount() / 100;
                String customerName = p.getCustomerName() != null ? p.getCustomerName() : "Valued Customer";
                String transactionDate = java.time.LocalDateTime.now()
                        .format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

                String htmlContent = "<html><body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>"
                        +
                        "<div style='max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;'>"
                        +
                        "<div style='text-align: center; margin-bottom: 20px;'>" +
                        "<h1 style='color: #2E96FF;'>Kanakkaalar</h1>" +
                        "</div>" +
                        "<h3>Dear " + customerName + ",</h3>" +
                        "<p>Thank you for your payment! We have successfully received your request for <strong>"
                        + p.getDescription() + "</strong>.</p>" +
                        "<div style='background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;'>" +
                        "<p style='margin: 0;'><strong>Order Details:</strong></p>" +
                        "<hr style='border: 0; border-top: 1px solid #ddd;'>" +
                        "<p style='margin: 5px 0;'><strong>Service:</strong> " + p.getDescription() + "</p>" +
                        "<p style='margin: 5px 0;'><strong>Amount Paid:</strong> ₹" + amount + "</p>" +
                        "<p style='margin: 5px 0;'><strong>Transaction ID:</strong> " + p.getPaymentId() + "</p>" +
                        "<p style='margin: 5px 0;'><strong>Order ID:</strong> " + p.getOrderId() + "</p>" +
                        "<p style='margin: 5px 0;'><strong>Date:</strong> " + transactionDate + "</p>" +
                        "</div>" +
                        "<p>Our experts will begin processing your documents immediately. You will receive further updates as we progress.</p>"
                        +
                        "<p>If you have any questions, feel free to reach out to us at <a href='mailto:" + adminEmail
                        + "'>" + adminEmail + "</a>.</p>" +
                        "<p style='margin-top: 30px;'>Best Regards,<br><strong>Team Kanakkaalar</strong></p>" +
                        "</div>" +
                        "</body></html>";

                helper.setText(htmlContent, true);
                mailSender.send(mimeMessage);
                log.info("Professional payment success HTML email sent to customer: {}", customerEmail);
            } catch (Exception e) {
                log.error("Failed to send HTML payment success email to customer: " + customerEmail, e);
            }
        }

        // Notify Admin (Keep this simple)
        if (adminEmail != null && !adminEmail.isBlank()) {
            try {
                SimpleMailMessage adminMsg = new SimpleMailMessage();
                adminMsg.setFrom(adminEmail);
                adminMsg.setTo(adminEmail);
                adminMsg.setSubject("New Payment Received: ₹" + (p.getAmount() / 100));

                String adminText = String.format(
                        "New Payment Received!\n\n" +
                                "Customer: %s\n" +
                                "Email: %s\n" +
                                "Phone: %s\n" +
                                "Service: %s\n" +
                                "Amount: ₹%d\n" +
                                "Payment ID: %s\n" +
                                "Order ID: %s",
                        p.getCustomerName(),
                        p.getCustomerEmail(),
                        p.getCustomerPhone(),
                        p.getDescription(),
                        p.getAmount() / 100,
                        p.getPaymentId(),
                        p.getOrderId());
                adminMsg.setText(adminText);
                mailSender.send(adminMsg);
            } catch (Exception e) {
                log.error("Failed to send payment notification to admin", e);
            }
        }
    }

    public String sendPaymentLink(com.calzone.financial.payment.PaymentController.SendLinkRequest req)
            throws Exception {
        String kId = getKeyId();
        String kSecret = getKeySecret();

        if (kId == null || kSecret == null) {
            throw new IllegalStateException("Payment keys not configured");
        }

        RazorpayClient razorpayClient = new RazorpayClient(kId, kSecret);

        // 1. Create Payment Link
        JSONObject paymentLinkRequest = new JSONObject();
        paymentLinkRequest.put("amount", (long) (req.amount * 100)); // paise
        paymentLinkRequest.put("currency", "INR");
        paymentLinkRequest.put("description",
                req.description != null ? req.description : "Payment for Deal " + req.dealId);

        JSONObject customer = new JSONObject();
        customer.put("name", "Customer");
        customer.put("email", req.customerEmail);
        if (req.customerPhone != null)
            customer.put("contact", req.customerPhone);
        paymentLinkRequest.put("customer", customer);

        // Disable SMS/Email sent by Razorpay if we send our own, or keep basic ones as
        // backup
        paymentLinkRequest.put("notify", new JSONObject().put("sms", false).put("email", false));
        paymentLinkRequest.put("callback_url", "https://kanakkaalar.in/payment/success");
        paymentLinkRequest.put("callback_method", "get");

        com.razorpay.PaymentLink paymentLink = razorpayClient.paymentLink.create(paymentLinkRequest);
        String shortUrl = paymentLink.get("short_url").toString();

        // 2. Send Email
        try {
            if (req.customerEmail != null && !req.customerEmail.isBlank()) {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setFrom(adminEmail);
                msg.setTo(req.customerEmail);
                msg.setSubject("Payment Request from Kanakkaalar");
                msg.setText("Dear Customer,\n\nPlease click the link below to verify and complete your payment of ₹"
                        + req.amount + " for " + (req.description != null ? req.description : "Service") + ".\n\n"
                        + shortUrl + "\n\nRegards,\nTeam Kanakkaalar");
                mailSender.send(msg);
                log.info("Sent payment link email to {}", req.customerEmail);
            }
        } catch (Exception e) {
            log.error("Failed to send email", e);
        }

        // 3. Send WhatsApp
        try {
            if (twilioSid != null && !twilioSid.isBlank() && req.customerPhone != null
                    && !req.customerPhone.isBlank()) {
                Twilio.init(twilioSid, twilioToken);
                String from = "whatsapp:" + twilioPhone;
                String to = "whatsapp:"
                        + (req.customerPhone.startsWith("+") ? req.customerPhone : "+91" + req.customerPhone);

                String body = "Hello! Please allow us to request a payment of *₹" + req.amount + "* for *"
                        + (req.description != null ? req.description : "Service") + "*.\n\nLink: " + shortUrl;

                Message.creator(
                        new com.twilio.type.PhoneNumber(to),
                        new com.twilio.type.PhoneNumber(from),
                        body).create();
                log.info("Sent WhatsApp payment link to {}", to);
            }
        } catch (Exception e) {
            log.error("Failed to send WhatsApp", e);
        }

        return shortUrl;
    }
}
