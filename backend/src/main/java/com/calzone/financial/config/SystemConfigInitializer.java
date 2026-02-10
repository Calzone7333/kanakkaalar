package com.calzone.financial.config;

import com.calzone.financial.system.SystemConfig;
import com.calzone.financial.system.SystemConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SystemConfigInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SystemConfigInitializer.class);
    private final SystemConfigRepository repository;

    public SystemConfigInitializer(SystemConfigRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        ensureKeyExists("RAZORPAY_KEY_ID", "");
        ensureKeyExists("RAZORPAY_KEY_SECRET", "");
        log.info("System configurations initialized successfully.");
    }

    private void ensureKeyExists(String key, String defaultValue) {
        if (!repository.existsById(key)) {
            log.info("Creating default system config for: {}", key);
            repository.save(new SystemConfig(key, defaultValue));
        } else {
            log.info("System config already exists: {}", key);
        }
    }
}
