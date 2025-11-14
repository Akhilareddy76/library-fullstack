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

    // In-memory store (stateless deployments will lose this; for production use DB/Redis)
    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    public OtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String email) {

        String code = String.format("%06d", random.nextInt(1_000_000));
        Instant expiryTime = Instant.now().plusSeconds(5 * 60);

        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("Your OTP (valid for 5 minutes)");
            msg.setText("Your OTP is: " + code + "\nThis OTP expires in 5 minutes.");

            mailSender.send(msg);  // if this fails → exception

            // only after successful send:
            store.put(email, new OtpEntry(code, expiryTime));

            System.out.println("📧 OTP sent to " + email + " → " + code);

        } catch (Exception ex) {
            System.out.println(" Failed to send OTP email: " + ex.getMessage());
            throw new RuntimeException("OTP_SEND_FAILED");
        }
    }


    public boolean verifyOtp(String email, String otp) {
        OtpEntry entry = store.get(email);
        if (entry == null) return false;
        if (entry.getExpiryTime().isBefore(Instant.now())) {
            store.remove(email);
            return false;
        }
        boolean match = entry.getOtp().equals(otp);
        if (match) store.remove(email);
        return match;
    }

    public void clear(String email) {
        store.remove(email);
    }

    public OtpEntry get(String email) {
        return store.get(email);
    }
}
