package com.akhila.library.lib.model;

import lombok.Data;

import java.time.Instant;

@Data
public class OtpEntry {
    private String otp;
    private Instant expiryTime;

    public OtpEntry(String otp, Instant expiryTime) {
        this.otp = otp;
        this.expiryTime = expiryTime;
    }
}
