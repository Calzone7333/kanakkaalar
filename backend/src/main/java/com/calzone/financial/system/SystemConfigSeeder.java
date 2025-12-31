package com.calzone.financial.system;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SystemConfigSeeder implements CommandLineRunner {

    private final SystemConfigRepository repository;

    public SystemConfigSeeder(SystemConfigRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedConfig("RAZORPAY_KEY_ID", "rzp_test_v9bZpQvmrVnUzZ");
        seedConfig("RAZORPAY_KEY_SECRET", "7WK71mMmiIYb4ZLi4Mcw1eDl");
    }

    private void seedConfig(String key, String defaultValue) {
        SystemConfig config = repository.findById(key).orElse(new SystemConfig(key, defaultValue));
        if (!defaultValue.equals(config.getConfigValue())) {
            config.setConfigValue(defaultValue);
            repository.save(config);
            System.out.println("Updated SystemConfig: " + key);
        } else {
            repository.save(config); // Ensure it's saved if new
        }
    }
}
