package com.calzone.financial.compliance;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplianceService {

    private final ComplianceRepository complianceRepository;

    public ComplianceService(ComplianceRepository complianceRepository) {
        this.complianceRepository = complianceRepository;
    }

    public List<Compliance> getAllCompliances() {
        return complianceRepository.findAll();
    }

    public Compliance getComplianceById(Long id) {
        return complianceRepository.findById(id).orElse(null);
    }

    public Compliance createCompliance(Compliance compliance) {
        return complianceRepository.save(compliance);
    }

    public Compliance updateCompliance(Long id, Compliance compliance) {
        Compliance existingCompliance = complianceRepository.findById(id).orElse(null);
        if (existingCompliance != null) {
            compliance.setId(id);
            return complianceRepository.save(compliance);
        }
        return null;
    }

    public void deleteCompliance(Long id) {
        complianceRepository.deleteById(id);
    }
}
