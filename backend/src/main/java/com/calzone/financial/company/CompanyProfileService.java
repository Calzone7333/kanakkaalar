package com.calzone.financial.company;

import com.calzone.financial.user.User;
import com.calzone.financial.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class CompanyProfileService {

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    @Autowired
    private UserRepository userRepository;

    private final Path rootLocation = Paths.get("uploads/balance-sheets");

    public CompanyProfileService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public CompanyProfile createOrUpdateProfile(Long userId, CompanyProfileRequest request, MultipartFile balanceSheet) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CompanyProfile profile = companyProfileRepository.findByUser(user)
                .orElse(new CompanyProfile());
        
        profile.setUser(user);
        profile.setBusinessName(request.getBusinessName());
        profile.setBusinessType(request.getBusinessType());
        profile.setIncorporationDate(request.getIncorporationDate());
        profile.setRegisteredAddress(request.getRegisteredAddress());
        profile.setGstin(request.getGstin());
        profile.setGstUsername(request.getGstUsername());
        profile.setTanNumber(request.getTanNumber());
        profile.setPrimaryBankName(request.getPrimaryBankName());
        profile.setCurrentBalance(request.getCurrentBalance());
        profile.setPanNumber(request.getPanNumber());

        if (balanceSheet != null && !balanceSheet.isEmpty()) {
            try {
                String filename = UUID.randomUUID().toString() + "_" + balanceSheet.getOriginalFilename();
                Files.copy(balanceSheet.getInputStream(), rootLocation.resolve(filename));
                profile.setBalanceSheetUrl(rootLocation.resolve(filename).toString());
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file", e);
            }
        }

        return companyProfileRepository.save(profile);
    }

    public CompanyProfile getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return companyProfileRepository.findByUser(user).orElse(null);
    }

    public List<CompanyProfile> getAllProfiles() {
        return companyProfileRepository.findAll();
    }
}
