package com.calzone.financial.casemgmt;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("caseMgmtController")
@RequestMapping("/api/cases")
public class CaseController {

    private final CaseRepository caseRepository;

    public CaseController(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    @PostMapping
    public ResponseEntity<CaseRecord> create(@RequestBody CaseRecord rec) {
        CaseRecord saved = caseRepository.save(rec);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<CaseRecord>> list() {
        return ResponseEntity.ok(caseRepository.findAll());
    }
}
