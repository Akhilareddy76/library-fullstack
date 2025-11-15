package com.akhila.library.lib.service;

import okhttp3.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${resend.from}")
    private String sender;

    private final SecureRandom random = new SecureRandom();
    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    private final OkHttpClient client = new OkHttpClient();
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    @PostConstruct
    public void checkEnv() {
        System.out.println("=== OtpService Loaded Variables ===");
        System.out.println("RESEND_API_KEY = " + (apiKey == null ? "NULL" : apiKey.substring(0, 8) + "..."));
        System.out.println("RESEND_FROM = " + sender);
        System.out.println("===================================");
    }

    public void sendOtp(String email) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("OTP_SEND_FAILED: Missing API Key");
        }
        if (sender == null || sender.isBlank()) {
            throw new RuntimeException("OTP_SEND_FAILED: Missing sender email");
        }

        String code = String.format("%06d", random.nextInt(1_000_000));
        Instant expiry = Instant.now().plusSeconds(300);

        try {
            JSONObject json = new JSONObject();
            json.put("from", sender);
            json.put("to", email);
            json.put("subject", "Your OTP Code");
            json.put("html", "<h2>Your OTP is: " + code + "</h2><p>Valid for 5 minutes.</p>");

            RequestBody body = RequestBody.create(json.toString(), JSON);

            Request request = new Request.Builder()
                    .url("https://api.resend.com/emails")
                    .post(body)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .addHeader("Content-Type", "application/json")
                    .build();

            Response response = client.newCall(request).execute();

            int status = response.code();
            String resp = response.body() != null ? response.body().string() : "";

            System.out.println("[Resend Response Status] " + status);
            System.out.println("[Resend Response Body] " + resp);

            if (!response.isSuccessful()) {
                throw new RuntimeException("OTP_SEND_FAILED: " + status + " " + resp);
            }

            store.put(email, new OtpEntry(code, expiry));
            System.out.println("OTP sent → " + email);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("OTP_SEND_FAILED: " + e.getMessage());
        }
    }

    public OtpEntry get(String email) {
        return store.get(email);
    }

    public void clear(String email) {
        store.remove(email);
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
