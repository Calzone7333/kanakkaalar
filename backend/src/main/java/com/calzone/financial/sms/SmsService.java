package com.calzone.financial.sms;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${sms.authToken:xxxxxyyyyy}")
    private String authToken;

    @Value("${twilio.fromPhone:+15017122661}")
    private String fromPhone;

    // In production, integrate Twilio/MSG91 here. For now, log the message with token stub.
    public void send(String to, String message) {
        System.out.printf("[sms-mock] To: %s | From: %s | Token: %s | Message: %s%n", to, fromPhone, authToken, message);
    }
}
