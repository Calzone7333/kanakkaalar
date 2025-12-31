package com.calzone.financial.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<Map<String, List<Notification>>> getAllNotifications() {
        List<Notification> notifications = notificationService.getAllNotifications();
        Map<String, List<Notification>> response = new HashMap<>();
        response.put("notifications", notifications);
        return ResponseEntity.ok(response);
    }
}