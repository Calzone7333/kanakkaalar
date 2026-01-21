package com.calzone.financial.auth;

import com.calzone.financial.email.EmailVerificationService;
import com.calzone.financial.notification.NotificationService;
import com.calzone.financial.user.User;
import com.calzone.financial.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final EmailVerificationService emailVerificationService;
    private final NotificationService notificationService;
    private final com.calzone.financial.lead.LeadRepository leadRepository;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder encoder,
            JwtService jwtService,
            EmailVerificationService emailVerificationService,
            NotificationService notificationService,
            com.calzone.financial.lead.LeadRepository leadRepository) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.emailVerificationService = emailVerificationService;
        this.notificationService = notificationService;
        this.leadRepository = leadRepository;
    }

    // ==================== REGISTER ====================
    public Map<String, Object> register(
            String email,
            String password,
            String fullName,
            String phone,
            MultipartFile profileImage) {
        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Encode password
        String encodedPassword = encoder.encode(password);

        // Create new user
        User user = User.builder() // Using the builder for consistency
                .email(email)
                .password(encodedPassword)
                .fullName(fullName)
                .phone(phone)
                .emailVerified(false)
                .build();

        // Handle profile image if provided
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                user.setProfileImage(profileImage.getBytes());
                user.setProfileImageType(profileImage.getContentType());
                LOGGER.info("Profile image being stored for user: {}", email);
            } catch (IOException e) {
                LOGGER.warn("Failed to process profile image for user {}: {}", email, e.getMessage());
                // Continue registration even if image processing fails
            }
        } else {
            LOGGER.info("No profile image provided for user: {}", email);
        }

        // Save user to database
        userRepository.save(user);

        // Create Lead for this user
        try {
            com.calzone.financial.lead.Lead lead = new com.calzone.financial.lead.Lead();
            lead.setName(fullName);
            lead.setEmail(email);
            lead.setPhone(phone);
            lead.setStatus("New");
            lead.setService("Signup");
            lead.setOwner(null); // Unassigned initially
            leadRepository.save(lead);
        } catch (Exception e) {
            LOGGER.error("Failed to create lead for new user: {}", email, e);
        }

        // Send verification email
        emailVerificationService.sendCode(email);

        // Create notification for Admin
        notificationService.createNotification("New user signup: " + email + " (" + fullName + ")");

        // Return success response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered. Please verify your email to activate the account.");
        response.put("email", user.getEmail());

        return response;
    }

    // ==================== LOGIN ====================
    public Map<String, Object> login(String email, String password) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        // Verify password
        if (!encoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        // Check if email is verified
        if (!user.getEmailVerified()) {
            throw new IllegalArgumentException("Email not verified. Please verify your email before logging in.");
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);

        // Extract role
        String role = "USER";
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            role = user.getRoles().iterator().next().getName();
        }

        // Build and return response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "phone", user.getPhone(),
                "role", role,
                "hasProfileImage", user.hasProfileImage()));

        return response;
    }

    // ==================== GET CURRENT USER ====================
    public User getCurrentUser() {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            throw new IllegalStateException("No authenticated user found");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));
    }

    // ==================== GOOGLE LOGIN ====================
    public Map<String, Object> loginGoogle(String token) {
        try {
            // Verify Access Token with Google userinfo endpoint
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://www.googleapis.com/oauth2/v3/userinfo"))
                    .header("Authorization", "Bearer " + token)
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> response = client.send(request,
                    java.net.http.HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new IllegalArgumentException("Invalid Google Token");
            }

            // Parse JSON
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(response.body());

            String email = root.get("email").asText();
            String name = root.has("name") ? root.get("name").asText() : email;

            // Check if user exists
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                // Create new user
                user = User.builder()
                        .email(email)
                        .fullName(name)
                        .password(encoder.encode(java.util.UUID.randomUUID().toString())) // Random password
                        .phone("") // Phone unknown, user can update later
                        .emailVerified(true) // Google verified
                        .build();

                userRepository.save(user);

                // Create Lead for this user
                try {
                    com.calzone.financial.lead.Lead lead = new com.calzone.financial.lead.Lead();
                    lead.setName(name);
                    lead.setEmail(email);
                    lead.setStatus("New");
                    lead.setService("Signup (Google)");
                    leadRepository.save(lead);
                } catch (Exception e) {
                    LOGGER.error("Failed to create lead for new google user: {}", email, e);
                }

                notificationService.createNotification("New user signup via Google: " + email);
            } else {
                if (!user.getEmailVerified()) {
                    user.setEmailVerified(true);
                    userRepository.save(user);
                }
            }

            // Generate JWT token
            String jwtToken = jwtService.generateToken(user);

            // Extract role
            String role = "USER";
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                role = user.getRoles().iterator().next().getName();
            }

            // Build response
            Map<String, Object> resp = new HashMap<>();
            resp.put("token", jwtToken);
            resp.put("user", Map.of(
                    "id", user.getId(),
                    "fullName", user.getFullName(),
                    "email", user.getEmail(),
                    "phone", user.getPhone() != null ? user.getPhone() : "",
                    "role", role,
                    "hasProfileImage", user.hasProfileImage()));

            return resp;

        } catch (Exception e) {
            throw new IllegalArgumentException("Google Login Failed: " + e.getMessage());
        }
    }
}
