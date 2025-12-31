package com.calzone.financial.email;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/verify-email")
public class EmailController {

    private final JavaMailSender mailSender;

    public EmailController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostMapping("/send")
    public ResponseEntity<Void> send(@RequestBody SendPayload payload) {
        // send to receiver
        SimpleMailMessage toReceiver = new SimpleMailMessage();
        toReceiver.setTo(payload.to);
        toReceiver.setSubject(payload.subject);
        toReceiver.setText(payload.message);
        if (payload.from != null && !payload.from.isBlank()) {
            toReceiver.setReplyTo(payload.from);
        }
        mailSender.send(toReceiver);

        // copy to sender if provided
        if (payload.from != null && !payload.from.isBlank()) {
            SimpleMailMessage toSender = new SimpleMailMessage();
            toSender.setTo(payload.from);
            toSender.setSubject("Copy: " + payload.subject);
            toSender.setText(payload.message);
            mailSender.send(toSender);
        }
        return ResponseEntity.ok().build();
    }

    public static class SendPayload {
        @Email
        public String from;
        @Email
        @NotBlank
        public String to;
        @NotBlank
        public String subject;
        @NotBlank
        public String message;
        public Map<String, Object> meta;
    }
}
