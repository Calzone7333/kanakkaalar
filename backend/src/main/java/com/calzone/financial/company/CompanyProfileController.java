package com.calzone.financial.company;

import com.calzone.financial.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/company")
public class CompanyProfileController {

    @Autowired
    private CompanyProfileService companyProfileService;

    @PostMapping("/setup")
    public ResponseEntity<CompanyProfile> setupCompanyProfile(
            @AuthenticationPrincipal User user,
            @ModelAttribute CompanyProfileRequest request,
            @RequestParam(value = "balanceSheet", required = false) MultipartFile balanceSheet) {
        
        CompanyProfile profile = companyProfileService.createOrUpdateProfile(user.getId(), request, balanceSheet);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profile")
    public ResponseEntity<CompanyProfile> getCompanyProfile(@AuthenticationPrincipal User user) {
        CompanyProfile profile = companyProfileService.getProfile(user.getId());
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CompanyProfile>> getAllCompanyProfiles() {
        return ResponseEntity.ok(companyProfileService.getAllProfiles());
    }
}
