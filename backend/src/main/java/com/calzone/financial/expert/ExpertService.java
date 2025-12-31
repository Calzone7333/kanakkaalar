package com.calzone.financial.expert;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ExpertService {

    private final ExpertRepository expertRepository;

    public ExpertService(ExpertRepository expertRepository) {
        this.expertRepository = expertRepository;
    }

    public List<Expert> getAllExperts() {
        return expertRepository.findAll();
    }

    public Optional<Expert> getExpertById(Long id) {
        return expertRepository.findById(id);
    }

    @Transactional
    public Expert createExpert(Expert expert, MultipartFile file) throws IOException {
        if (file != null && !file.isEmpty()) {
            expert.setImage(file.getBytes());
            expert.setImageContentType(file.getContentType());
        }
        return expertRepository.save(expert);
    }

    @Transactional
    public Expert updateExpert(Long id, Expert expertDetails, MultipartFile file) throws IOException {
        return expertRepository.findById(id).map(expert -> {
            expert.setName(expertDetails.getName());
            expert.setQualification(expertDetails.getQualification());
            expert.setExperience(expertDetails.getExperience());
            expert.setRating(expertDetails.getRating());
            expert.setReviews(expertDetails.getReviews());
            expert.setLanguages(expertDetails.getLanguages());
            expert.setSpecialization(expertDetails.getSpecialization());
            expert.setPrice(expertDetails.getPrice());
            expert.setAvailable(expertDetails.isAvailable());
            expert.setBio(expertDetails.getBio());
            
            if (file != null && !file.isEmpty()) {
                try {
                    expert.setImage(file.getBytes());
                    expert.setImageContentType(file.getContentType());
                } catch (IOException e) {
                    throw new RuntimeException("Failed to process image file", e);
                }
            }
            
            return expertRepository.save(expert);
        }).orElseThrow(() -> new RuntimeException("Expert not found with id " + id));
    }

    @Transactional
    public void deleteExpert(Long id) {
        expertRepository.deleteById(id);
    }
}
