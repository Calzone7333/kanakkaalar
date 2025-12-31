package com.calzone.financial.compliance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compliances")
public class ComplianceController {

    @Autowired
    private  ComplianceService complianceService;

   
    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @GetMapping
    public ResponseEntity<List<Compliance>> getAllCompliances() {
        List<Compliance> compliances = complianceService.getAllCompliances();
        return new ResponseEntity<>(compliances, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compliance> getComplianceById(@PathVariable Long id) {
        Compliance compliance = complianceService.getComplianceById(id);
        if (compliance != null) {
            return new ResponseEntity<>(compliance, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Compliance> createCompliance(@RequestBody Compliance compliance) {
        Compliance createdCompliance = complianceService.createCompliance(compliance);
        return new ResponseEntity<>(createdCompliance, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Compliance> updateCompliance(@PathVariable Long id, @RequestBody Compliance compliance) {
        Compliance updatedCompliance = complianceService.updateCompliance(id, compliance);
        if (updatedCompliance != null) {
            return new ResponseEntity<>(updatedCompliance, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompliance(@PathVariable Long id) {
        complianceService.deleteCompliance(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
