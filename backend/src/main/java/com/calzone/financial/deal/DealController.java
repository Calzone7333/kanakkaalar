package com.calzone.financial.deal;

import com.calzone.financial.deal.dto.DealRequest;
import com.calzone.financial.deal.dto.DealResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    @GetMapping
    public ResponseEntity<List<DealResponse>> getAllDeals() {
        return ResponseEntity.ok(dealService.getAllDeals());
    }

    @PostMapping
    public ResponseEntity<DealResponse> createDeal(@Valid @RequestBody DealRequest request) {
        return ResponseEntity.ok(dealService.createDeal(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DealResponse> updateDeal(@PathVariable Long id, @RequestBody java.util.Map<String, Object> updates) {
        return ResponseEntity.ok(dealService.updateDeal(id, updates));
    }
}
