package com.calzone.financial.lead;

import com.calzone.financial.lead.dto.LeadRequest;
import com.calzone.financial.lead.dto.LeadResponse;
import com.calzone.financial.lead.dto.LeadUpdateRequest;
import com.calzone.financial.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("leadServiceController")
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    public ResponseEntity<List<LeadResponse>> findAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leadService.findAll(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> findById(@PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leadService.findById(id, user));
    }

    @PostMapping
    public ResponseEntity<LeadResponse> create(@Valid @RequestBody LeadRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leadService.create(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadResponse> update(@PathVariable Long id,
            @Valid @RequestBody LeadUpdateRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leadService.update(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        leadService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
