package com.calzone.financial.expert;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class ExpertDataSeeder implements CommandLineRunner {

    private final ExpertRepository expertRepository;

    public ExpertDataSeeder(ExpertRepository expertRepository) {
        this.expertRepository = expertRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (expertRepository.count() == 0) {
            Expert e1 = new Expert();
            e1.setName("Rahul Sharma");
            e1.setQualification("Chartered Accountant");
            e1.setExperience("12 Years");
            e1.setRating(4.9);
            e1.setReviews(124);
            e1.setLanguages(Arrays.asList("English", "Hindi"));
            e1.setSpecialization(Arrays.asList("GST", "Income Tax", "Auditing"));
            e1.setPrice("₹1500");
            e1.setAvailable(true);
            e1.setBio("Experienced CA with a focus on tax planning.");
            // Image is null by default
            
            Expert e2 = new Expert();
            e2.setName("Priya Verma");
            e2.setQualification("Company Secretary");
            e2.setExperience("8 Years");
            e2.setRating(4.8);
            e2.setReviews(89);
            e2.setLanguages(Arrays.asList("English", "Tamil"));
            e2.setSpecialization(Arrays.asList("Company Law", "Compliance", "Startups"));
            e2.setPrice("₹1200");
            e2.setAvailable(true);
            e2.setBio("Specialist in corporate compliance and secretarial audits.");

            expertRepository.saveAll(Arrays.asList(e1, e2));
        }
    }
}
