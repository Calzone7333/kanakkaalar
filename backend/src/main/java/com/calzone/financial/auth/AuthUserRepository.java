package com.calzone.financial.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Renamed to create a unique bean name: 'authUserRepository'
public interface AuthUserRepository extends JpaRepository<User, Long> { 
    Optional<User> findByEmail(String email);
}