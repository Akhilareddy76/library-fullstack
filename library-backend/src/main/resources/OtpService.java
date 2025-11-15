package com.akhila.library.lib.service;

import com.akhila.library.lib.model.OtpEntry;
import com.brevo.ApiClient;
import com.brevo.ApiException;
import com.brevo.Configuration;
import com.brevo.api.TransactionalEmailsApi;
import com.brevo.models.SendSmtpEmail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final SecureRandom random = new SecureRandom();
    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    @Value("${BREVO_API_KEY}")
    private String apiKey;

    public void sendOtp(String email) {

        String code = String.format("%06d", random.nextInt(1_000_000));
        Instant expiry = Instant.now().plusSeconds(300);

        try {
            // Initialize API client
            ApiClient client = Configuration.getDefaultApiClient();
            client.setApiKey(apiKey);

            TransactionalEmailsApi apiInstance = new TransactionalEmailsApi(client);

            // Build email
            SendSmtpEmail sendSmtpEmail = new SendSmtpEmail();
            sendSmtpEmail.setSubject("Your OTP Code");
            sendSmtpEmail.setTextContent("Your OTP is: " + code + "\nValid for 5 minutes.");
            sendSmtpEmail.setSender(
                    new SendSmtpEmail.Sender()
                            .name("Library App")
                            .email("yourbrevoemail@gmail.com")
            );
            sendSmtpEmail.addTo(
                    new SendSmtpEmail.To()
                            .email(email)
            );

            // Send email
            apiInstance.sendTransacEmail(sendSmtpEmail);

            // Store OTP
            store.put(email, new OtpEntry(code, expiry));

            System.out.println("OTP sent successfully → " + email);

        } catch (ApiException ex) {
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
