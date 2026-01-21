package com.calzone.financial.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service-items")
public class ServiceItemController {

    private final ServiceItemService service;

    public ServiceItemController(ServiceItemService service) {
        this.service = service;
    }

    // Public/User: Get grouped active items for the dashboard
    @GetMapping("/active-grouped")
    public ResponseEntity<Map<String, Map<String, List<ServiceItem>>>> getGroupedActiveItems() {
        return ResponseEntity.ok(service.getGroupedActiveItems());
    }

    // Admin: Get all items (active and inactive)
    @GetMapping("/all")
    public ResponseEntity<List<ServiceItem>> getAllItems() {
        return ResponseEntity.ok(service.getAllItems());
    }

    // Admin: Create
    @PostMapping
    public ResponseEntity<ServiceItem> createItem(@RequestBody ServiceItem item) {
        return ResponseEntity.ok(service.createItem(item));
    }

    // Admin: Update
    @PutMapping("/{id}")
    public ResponseEntity<ServiceItem> updateItem(@PathVariable Long id, @RequestBody ServiceItem item) {
        return ResponseEntity.ok(service.updateItem(id, item));
    }

    // Admin: Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        service.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
