package com.akhila.library.lib.service;

import com.akhila.library.lib.model.OtpEntry;
import org.springframework.beans.factory.annotation.Value;
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
    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    public OtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String email) {

        String code = String.format("%06d", random.nextInt(1_000_000));
        Instant expiry = Instant.now().plusSeconds(300);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your OTP Code");
            message.setText("Your OTP is: " + code + "\nValid for 5 minutes.");
            message.setFrom("akkiakhila472@gmail.com"); // ✅ FIXED

            mailSender.send(message);

            store.put(email, new OtpEntry(code, expiry));

            System.out.println("OTP sent successfully → " + email);

        } catch (Exception ex) {
            ex.printStackTrace();
            throw new RuntimeException("OTP_EMAIL_SEND_FAILED");
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
}
