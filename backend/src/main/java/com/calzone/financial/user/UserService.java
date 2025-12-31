package com.calzone.financial.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Define a constant for the maximum image size (e.g., 5MB)
    private static final long MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User updateUserProfile(User user, String fullName, String phone, String password, MultipartFile profileImage) throws IOException, IllegalArgumentException {
        boolean changed = false;

        // Handle profile image update
        if (profileImage != null && !profileImage.isEmpty()) {
            if (profileImage.getSize() > MAX_IMAGE_SIZE_BYTES) {
                throw new IllegalArgumentException("Image size exceeds the limit of 5MB.");
            }

            List<String> allowedTypes = Arrays.asList("image/jpeg", "image/png", "image/gif", "image/svg+xml");
            if (!allowedTypes.contains(profileImage.getContentType())) {
                throw new IllegalArgumentException("Invalid image type. Only JPG, PNG, GIF, SVG are allowed.");
            }

            user.setProfileImage(profileImage.getBytes());
            user.setProfileImageType(profileImage.getContentType());
            changed = true;
        }

        // Update full name
        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName.trim());
            changed = true;
        }

        // Update phone
        if (phone != null && !phone.isBlank()) {
            user.setPhone(phone.trim());
            changed = true;
        }

        // Update password
        if (password != null && !password.isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
            changed = true;
        }

        if (changed) {
            return userRepository.save(user);
        }

        return user;
    }
}