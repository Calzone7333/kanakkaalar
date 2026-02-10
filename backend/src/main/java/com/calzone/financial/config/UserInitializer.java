package com.calzone.financial.config;

import com.calzone.financial.user.Role;
import com.calzone.financial.user.RoleRepository;
import com.calzone.financial.user.User;
import com.calzone.financial.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;

@Component
public class UserInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(UserInitializer.class);

    @Value("${spring.mail.username}")
    private String adminEmail;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserInitializer(UserRepository userRepository, RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (adminEmail == null || adminEmail.isBlank()) {
            log.warn("Admin email not configured in application.properties");
            return;
        }

        // 1. Ensure ADMIN role exists
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    log.info("Creating ADMIN role...");
                    Role role = new Role();
                    role.setName("ADMIN");
                    return roleRepository.save(role);
                });

        // 2. Ensure admin user exists
        if (!userRepository.existsByEmail(adminEmail)) {
            log.info("Creating admin user: {}...", adminEmail);
            User admin = new User();
            admin.setFullName("System Admin");
            admin.setEmail(adminEmail);
            admin.setPhone("0000000000");
            admin.setPassword(passwordEncoder.encode("admin123")); // Default password
            admin.setEmailVerified(true);
            admin.setPhoneVerified(true);
            admin.setRoles(new HashSet<>(Collections.singletonList(adminRole)));
            userRepository.save(admin);
            log.info("Admin user created successfully.");
        } else {
            log.info("Admin user already exists: {}", adminEmail);
        }
    }
}
