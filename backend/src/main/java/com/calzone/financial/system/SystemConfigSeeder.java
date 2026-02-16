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
        seedConfig("RAZORPAY_KEY_ID", "rzp_live_RsCU4fzmfxNC71");
        seedConfig("RAZORPAY_KEY_SECRET", "t8rH6pclcf1r00xVUMsNJ1b4");
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
