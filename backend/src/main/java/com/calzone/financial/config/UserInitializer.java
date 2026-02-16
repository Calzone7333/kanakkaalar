package com.calzone.financial.config;

import com.calzone.financial.user.Role;
import com.calzone.financial.user.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class UserInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(UserInitializer.class);

    private final RoleRepository roleRepository;

    public UserInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        log.info("Checking and initializing system roles...");

        List<String> rolesToEnsure = Arrays.asList("ADMIN", "EMPLOYEE", "AGENT");

        for (String roleName : rolesToEnsure) {
            if (!roleRepository.findByName(roleName).isPresent()) {
                log.info("Creating {} role...", roleName);
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }
        }

        log.info("Role initialization complete. No default users created.");
    }
}
