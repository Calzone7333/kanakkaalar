package com.calzone.financial.email;

import com.calzone.financial.user.UserRepository;

import jakarta.validation.constraints.Email;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

import org.springframework.mail.MailException;

@Service
public class EmailVerificationService {

    private static final Duration TTL = Duration.ofMinutes(10);
    private static final SecureRandom RNG = new SecureRandom();

    private final VerificationCodeRepository repo;
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public EmailVerificationService(VerificationCodeRepository repo, JavaMailSender mailSender,
            UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.mailSender = mailSender;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ FIX: Removed @Transactional from this field.
    @Value("${app.mail.return-code:false}")
    private boolean returnCode;

    @Transactional // Correctly annotated on the method
    public String sendCode(@Email String email) {
        // Generate and save code
        String code = generateCode(6);
        Instant now = Instant.now();

        // Purge old/expired codes for this email
        repo.purgeByEmailOrExpired(email.toLowerCase(), now);

        VerificationCode vc = new VerificationCode();
        vc.setEmail(email.toLowerCase());
        vc.setCodeHash(passwordEncoder.encode(code)); // Hash the code for security
        vc.setExpiresAt(now.plus(TTL));
        vc.setUsed(false);
        vc.setAttempts(0);
        vc.setMaxAttempts(5);
        repo.save(vc);

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        if (fromEmail != null && !fromEmail.isBlank()) {
            message.setFrom(fromEmail);
        }
        message.setSubject("Verify your email for Calzone Financial");
        message.setText(
                "Your verification code is: " + code + "\nThis code expires in " + TTL.toMinutes() + " minutes.");
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + email + ": " + e.getMessage());
            e.printStackTrace(); // Print full stack for debugging
            if (returnCode) {
                // In debug mode return the code so frontend can show it
                return code;
            }
            // Throwing a public error to the client lets them know the email service
            // failed.
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to send verification email. Please check server logs.");
        }
        // In debug mode return the code
        if (returnCode)
            return code;
        return null;
    }

    @Transactional // Correctly annotated on the method
    public void verifyCode(@Email String email, String code) {
        VerificationCode latest = repo.findActiveLatest(email.toLowerCase(), Instant.now())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired or not found"));

        if (latest.isUsed() || latest.getAttempts() >= latest.getMaxAttempts()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired or too many attempts.");
        }

        // Verify the provided code against the stored hash
        boolean match = passwordEncoder.matches(code, latest.getCodeHash());
        if (!match) {
            latest.setAttempts(latest.getAttempts() + 1);
            repo.save(latest);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid code");
        }

        // Mark code as used and verify the user's email
        latest.setUsed(true);
        repo.save(latest);

        userRepository.findByEmail(email.toLowerCase()).ifPresent(u -> {
            if (u.getEmailVerified() == null || !u.getEmailVerified()) {
                u.setEmailVerified(true);
                userRepository.save(u);
            }
        });
    }

    @Transactional
    public void resetPassword(@Email String email, String code, String newPassword) {
        // Re-use verification logic (will mark code used)
        verifyCode(email, code);

        // Find the user and update password
        userRepository.findByEmail(email.toLowerCase()).ifPresentOrElse(u -> {
            u.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(u);
        }, () -> {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        });
    }

    private static String generateCode(int length) {
        // Generates a random N-digit number string
        int min = (int) Math.pow(10, length - 1);
        int max = (int) Math.pow(10, length) - 1;
        int n = RNG.nextInt(max - min + 1) + min;
        return Integer.toString(n);
    }
}
