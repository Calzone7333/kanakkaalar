package com.calzone.financial.user;

import com.calzone.financial.auth.dto.UserProfile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    // ==================== GET ALL USERS ====================
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthenticated"));
        }

        List<UserProfile> users = userRepository.findAll().stream()
                .map(u -> new UserProfile(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getPhone(),
                        u.hasProfileImage(),
                        u.getRoles().stream().findFirst().map(Role::getName).orElse("USER")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("users", users));
    }

    // ==================== GET CURRENT USER PROFILE ====================
    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthenticated"));
        }

        UserProfile profile = new UserProfile(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.hasProfileImage(),
                user.getRoles().stream().findFirst().map(Role::getName).orElse("USER"));

        return ResponseEntity.ok(profile);
    }

    // ==================== GET PROFILE IMAGE ====================
    @GetMapping("/me/profile-image")
    public ResponseEntity<Resource> getProfileImage(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        // Check if user has a profile image
        if (!user.hasProfileImage()) {
            return ResponseEntity.notFound().build();
        }

        byte[] imageData = user.getProfileImage();
        if (imageData == null || imageData.length == 0) {
            return ResponseEntity.notFound().build();
        }

        ByteArrayResource resource = new ByteArrayResource(imageData);
        MediaType mediaType;

        try {
            mediaType = MediaType.parseMediaType(user.getProfileImageType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(resource);
    }

    // ==================== UPDATE USER PROFILE ====================
    @PutMapping("/me")
    public ResponseEntity<?> updateMe(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthenticated"));
        }

        try {
            User updatedUser = userService.updateUserProfile(user, fullName, phone, password, profileImage);

            UserProfile profile = new UserProfile(
                    updatedUser.getId(),
                    updatedUser.getFullName(),
                    updatedUser.getEmail(),
                    updatedUser.getPhone(),
                    updatedUser.hasProfileImage(),
                    updatedUser.getRoles().stream().findFirst().map(Role::getName).orElse("USER"));

            return ResponseEntity.ok(Map.of(
                    "user", profile,
                    "message", "Profile updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "An unexpected error occurred."));
        }
    }

    // ==================== GET USER BY ID ====================
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> new UserProfile(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getPhone(),
                        u.hasProfileImage(),
                        u.getRoles().stream().findFirst().map(Role::getName).orElse("USER")))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
