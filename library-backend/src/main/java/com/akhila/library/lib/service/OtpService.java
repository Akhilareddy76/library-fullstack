package com.akhila.library.lib.service;

import com.akhila.library.lib.model.OtpEntry;
import okhttp3.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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

    // =============================
    // SEND OTP
    // =============================
    public void sendOtp(String email) {

        String code = String.format("%06d", random.nextInt(1_000_000));
        Instant expiry = Instant.now().plusSeconds(300); // 5 minutes

        try {
            OkHttpClient client = new OkHttpClient();

            JSONObject bodyJson = new JSONObject();
            bodyJson.put("from", sender);
            bodyJson.put("to", email);
            bodyJson.put("subject", "Your OTP Code");
            bodyJson.put("html", "<h2>Your OTP is: " + code + "</h2><p>Valid for 5 minutes.</p>");

            RequestBody body = RequestBody.create(
                    bodyJson.toString(),
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url("https://api.resend.com/emails")
                    .post(body)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .build();

            Response response = client.newCall(request).execute();

            if (!response.isSuccessful()) {
                throw new RuntimeException("OTP_SEND_FAILED");
            }

            store.put(email, new OtpEntry(code, expiry));
            System.out.println("OTP sent → " + email);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("OTP_SEND_FAILED");
        }
    }

    // =============================
    // GET OTP ENTRY
    // =============================
    public OtpEntry get(String email) {
        return store.get(email);
    }

    // =============================
    // CLEAR OTP ENTRY
    // =============================
    public void clear(String email) {
        store.remove(email);
    }

    // =============================
    // VERIFY DIRECTLY
    // =============================
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
