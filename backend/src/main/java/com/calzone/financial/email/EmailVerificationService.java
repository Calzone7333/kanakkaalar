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
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

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
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            if (fromEmail != null && !fromEmail.isBlank()) {
                helper.setFrom(fromEmail, "Kanakkaalar");
            } else {
                helper.setFrom("info@kanakkaalar.com", "Kanakkaalar");
            }

            helper.setTo(email);
            helper.setSubject("Verify your email - Kanakkaalar");

            String htmlContent = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "    <style>" +
                    "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6; }"
                    +
                    "        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }"
                    +
                    "        .logo-section { padding: 25px; text-align: center; background: #ffffff; }" +
                    "        .header { background-color: #1A7F7D; padding: 40px 20px; text-align: center; color: white; }"
                    +
                    "        .icon-circle { width: 70px; height: 70px; background: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px; margin: 0 auto 15px auto; }"
                    +
                    "        .content { padding: 40px 30px; text-align: center; color: #333333; }" +
                    "        .title { font-size: 26px; font-weight: 700; margin-bottom: 20px; color: #333333; }" +
                    "        .otp-box { background-color: #f0fdfa; border: 2px dashed #1A7F7D; padding: 25px; margin: 30px auto; border-radius: 12px; width: fit-content; min-width: 200px; }"
                    +
                    "        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #1A7F7D; margin: 0; }"
                    +
                    "        .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 13px; line-height: 1.6; }"
                    +
                    "        .social-icons { margin-bottom: 20px; }" +
                    "        .social-icons a { margin: 0 12px; text-decoration: none; color: #1A7F7D; font-size: 20px; font-weight: bold; }"
                    +
                    "        .divider { height: 1px; background-color: #e5e7eb; margin: 20px 0; }" +
                    "        .address { font-style: normal; color: #9ca3af; }" +
                    "    </style>" +
                    "</head>" +
                    "<body>" +
                    "    <div class=\"logo-section\">" +
                    "        <img src=\"https://kanakkaalar.com/assets/kanakkaalar_logo-BNI-NPJA.png\" alt=\"Kanakkaalar\" style=\"height: 70px; width: auto; object-fit: contain;\">"
                    +
                    "    </div>" +
                    "    <div class=\"container\">" +
                    "        <div class=\"header\">" +
                    "            <div class=\"icon-circle\">" +
                    "                <svg width=\"35\" height=\"35\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#1A7F7D\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\"></path><polyline points=\"22,6 12,13 2,6\"></polyline></svg>"
                    +
                    "            </div>" +
                    "            <div style=\"font-size: 28px; font-weight: 600;\">Email Verification</div>" +
                    "        </div>" +
                    "        <div class=\"content\">" +
                    "            <p style=\"font-size: 17px; margin-bottom: 10px;\">Hello,</p>" +
                    "            <p style=\"font-size: 16px; color: #4b5563; line-height: 1.6;\">You're almost set to start enjoying <strong>Kanakkaalar</strong>. Simply use the verification code below to verify your email address and get started.</p>"
                    +
                    "            " +
                    "            <div class=\"otp-box\">" +
                    "                <div class=\"otp-code\">" + code + "</div>" +
                    "            </div>" +
                    "            " +
                    "            <p style=\"color: #6b7280; font-size: 14px; margin-top: 20px;\">This code expires in <strong>"
                    + TTL.toMinutes()
                    + " minutes</strong>.<br>If you didn't request this, please ignore this email.</p>" +
                    "        </div>" +
                    "        <div class=\"footer\">" +
                    "            <div class=\"social-icons\">" +
                    "                <a href=\"https://www.facebook.com/profile.php?id=61586802190304\"><img src=\"https://img.icons8.com/color/32/facebook-new.png\" alt=\"Facebook\" style=\"margin: 0 10px;\"></a>"
                    +
                    "                <a href=\"https://www.linkedin.com/company/kanakkaalar\"><img src=\"https://img.icons8.com/color/32/linkedin.png\" alt=\"LinkedIn\" style=\"margin: 0 10px;\"></a>"
                    +
                    "                <a href=\"https://www.instagram.com/kanakkaalar_english/\"><img src=\"https://img.icons8.com/color/32/instagram-new--v1.png\" alt=\"Instagram\" style=\"margin: 0 10px;\"></a>"
                    +
                    "            </div>" +
                    "            <p class=\"address\">3/32, 1st Main Road, Ayyappa Nagar, Virugambakkam, Chennai-600092</p>"
                    +
                    "            <div class=\"divider\"></div>" +
                    "            <p style=\"margin-top: 15px;\">" +
                    "                <a href=\"https://kanakkaalar.in/privacy-policy\" style=\"color: #1A7F7D; text-decoration: none;\">Privacy Policy</a> | "
                    +
                    "                <a href=\"https://kanakkaalar.in/contact\" style=\"color: #1A7F7D; text-decoration: none;\">Contact Details</a>"
                    +
                    "            </p>" +
                    "            <p style=\"margin-top: 10px;\">&copy; 2026 Hado Global Services pvt Ltd. All rights reserved.</p>"
                    +
                    "        </div>" +
                    "    </div>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
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
