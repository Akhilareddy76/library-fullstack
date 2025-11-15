package com.akhila.library.lib.service;

import com.akhila.library.lib.model.OtpEntry;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final JavaMailSender mailSender;
    private final SecureRandom random = new SecureRandom();

    // In-memory OTP store
    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    public OtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // -----------------------------------------------------------------------------------
    // SEND OTP
    // -----------------------------------------------------------------------------------
    public void sendOtp(String email) {

        String code = String.format("%06d", random.nextInt(1_000_000));
        Instant expiryTime = Instant.now().plusSeconds(5 * 60);

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("Your One-Time Password (Valid for 5 Minutes)");
        msg.setText(
                "Hello,\n\n" +
                        "Your OTP is: " + code + "\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "If you did not request this code, please ignore this email.\n\n" +
                        "Regards,\nAkhila Library System"
        );

        try {
            mailSender.send(msg);
            store.put(email, new OtpEntry(code, expiryTime));
            System.out.println("📧 OTP Sent Successfully → " + email + " | OTP: " + code);

        } catch (Exception ex) {
            System.err.println("❌ Failed to send OTP to " + email + ": " + ex.getMessage());
            throw new RuntimeException("OTP_EMAIL_SEND_FAILED");
        }
    }

    // -----------------------------------------------------------------------------------
    // VERIFY OTP
    // -----------------------------------------------------------------------------------
    public boolean verifyOtp(String email, String otp) {
        OtpEntry entry = store.get(email);

        if (entry == null) {
            System.out.println("❌ No OTP stored for " + email);
            return false;
        }

        if (entry.getExpiryTime().isBefore(Instant.now())) {
            System.out.println("⌛ OTP expired for " + email);
            store.remove(email);
            return false;
        }

        boolean match = entry.getOtp().equals(otp);

        if (match) {
            System.out.println("✅ OTP verified for: " + email);
            store.remove(email);
        } else {
            System.out.println("❌ OTP mismatch for: " + email);
        }

        return match;
    }

    // -----------------------------------------------------------------------------------
    // HELPERS
    // -----------------------------------------------------------------------------------
    public void clear(String email) {
        store.remove(email);
    }

    public OtpEntry get(String email) {
        return store.get(email);
    }
}
