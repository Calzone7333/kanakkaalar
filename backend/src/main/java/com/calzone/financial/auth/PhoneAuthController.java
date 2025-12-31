package com.calzone.financial.auth;

// import com.calzone.financial.auth.dto.AuthResponse;
// import com.calzone.financial.auth.dto.UserProfile;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.calzone.financial.sms.PhoneOtp;
import com.calzone.financial.sms.PhoneOtpRepository;
import com.calzone.financial.sms.SmsService;
import com.calzone.financial.user.User;
import com.calzone.financial.user.UserRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/auth")
public class PhoneAuthController {

    private static final Duration TTL = Duration.ofMinutes(5);
    private static final SecureRandom RNG = new SecureRandom();

    public record PhoneReq(@NotBlank String phone) {}
    public record VerifyReq(@NotBlank String phone, @NotBlank String code) {}

    private final PhoneOtpRepository otpRepo;
    private final SmsService smsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public PhoneAuthController(PhoneOtpRepository otpRepo, SmsService smsService, UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.otpRepo = otpRepo;
        this.smsService = smsService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    private static String sanitizePhone(String phone) {
        return phone == null ? "" : phone.replaceAll("[^0-9]", "");
    }

    private static String generateCode(int length) {
        int min = (int) Math.pow(10, length - 1);
        int max = (int) Math.pow(10, length) - 1;
        int n = RNG.nextInt(max - min + 1) + min;
        return Integer.toString(n);
    }

    @PostMapping("/login-phone")
    public ResponseEntity<?> loginPhone(@Valid @RequestBody PhoneReq req) {
        String ph = sanitizePhone(req.phone());
        if (!ph.matches("^[0-9]{7,15}$")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid phone required");

        // Require existing user with this phone
        if (!userRepository.existsByPhone(ph)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found for this phone");
        }

        // Purge and create new OTP
        otpRepo.purgeByPhoneOrExpired(ph, Instant.now());
        String code = generateCode(6);
        PhoneOtp otp = new PhoneOtp();
        otp.setPhone(ph);
        otp.setCodeHash(passwordEncoder.encode(code));
        otp.setExpiresAt(Instant.now().plus(TTL));
        otp.setUsed(false);
        otpRepo.save(otp);

        // Send SMS (mock logs token)
        smsService.send(ph, "Your OTP is " + code);
        return ResponseEntity.ok(java.util.Map.of("message", "OTP sent", "code", code));
    }

    @PostMapping("/verify-phone")
    public ResponseEntity<Map<String, Object>> verifyPhone(@Valid @RequestBody VerifyReq req) {
        String ph = sanitizePhone(req.phone());
        String code = req.code();
        PhoneOtp latest = otpRepo.findActiveLatest(ph, Instant.now())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired or not found"));

        if (latest.isUsed() || latest.getAttempts() >= latest.getMaxAttempts()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired or too many attempts");
        }

        boolean match = passwordEncoder.matches(code, latest.getCodeHash());
        if (!match) {
            latest.setAttempts(latest.getAttempts() + 1);
            otpRepo.save(latest);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid code");
        }

        latest.setUsed(true);
        otpRepo.save(latest);

        User user = userRepository.findByPhone(ph)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getPhoneVerified() == null || !user.getPhoneVerified()) {
            user.setPhoneVerified(true);
            userRepository.save(user);
        }

        String token = jwtService.generateToken(user);
        String role = "USER";
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            role = user.getRoles().iterator().next().getName();
        }
        java.util.Map<String,Object> userMap = java.util.Map.of(
            "id", user.getId(),
            "fullName", user.getFullName(),
            "email", user.getEmail(),
            "phone", user.getPhone(),
            "role", role,
            // Return the stored path/filename for the profile image (may be null or empty)
            "profileImagePath", user.getProfileImage()
        );
        return ResponseEntity.ok(java.util.Map.of("token", token, "user", userMap));
    }
}
