package com.calzone.financial.config;

import java.io.IOException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.calzone.financial.user.Role;
import com.calzone.financial.user.RoleRepository;
import com.calzone.financial.user.User;
import com.calzone.financial.user.UserRepository;

public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User createEmployee(String email, String fullName, String phone, String password, String role, String address, MultipartFile profileImageFile) throws IOException {
        User user = new User();
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPhone(phone != null ? phone : "");

        if (password != null && !password.isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
        } else {
            user.setPassword(""); // Set a non-null default
        }

        String roleName = (role == null || role.isBlank()) ? "EMPLOYEE" : role.toUpperCase();
        Role userRole = roleRepository.findByName(roleName).orElseGet(() -> roleRepository.save(new Role(roleName)));
        user.getRoles().add(userRole);

        if (address != null) {
            user.setAddress(address);
        }

        if (profileImageFile != null && !profileImageFile.isEmpty()) {
            user.setProfileImage(profileImageFile.getBytes());
            user.setProfileImageType(profileImageFile.getContentType());
        }

        return userRepository.save(user);
    }

    @Transactional
    public User updateEmployee(Long id, String fullName, String phone, String password, String role, String address, MultipartFile profileImageFile) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + id));

        if (fullName != null) {
            user.setFullName(fullName);
        }
        if (phone != null) {
            user.setPhone(phone);
        }
        if (password != null && !password.isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
        }

        if (role != null && !role.isBlank()) {
            String roleName = role.toUpperCase();
            Role newRole = roleRepository.findByName(roleName).orElseGet(() -> roleRepository.save(new Role(roleName)));
            user.getRoles().clear();
            user.getRoles().add(newRole);
        }

        if (address != null) {
            user.setAddress(address);
        }

        if (profileImageFile != null && !profileImageFile.isEmpty()) {
            user.setProfileImage(profileImageFile.getBytes());
            user.setProfileImageType(profileImageFile.getContentType());
        }

        return userRepository.save(user);
    }
}