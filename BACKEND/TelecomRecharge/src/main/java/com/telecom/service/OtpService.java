package com.telecom.service;

import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {
    private final Map<String, OtpEntry> otpStore = new HashMap<>();
    private static final int OTP_EXPIRY_MINUTES = 20;

    @Value("${twilio.account.sid}")
    private String twilioAccountSid;

    @Value("${twilio.auth.token}")
    private String twilioAuthToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    public OtpService() {}

    public String generateOtp(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        String normalizedPhone = phone.startsWith("+") ? phone : "+91" + phone;
        if (normalizedPhone.equals(twilioPhoneNumber)) {
            throw new IllegalArgumentException("Cannot send OTP to the Twilio phone number itself: " + normalizedPhone);
        }
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(normalizedPhone, new OtpEntry(otp, LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES)));
        sendOtpViaTwilio(normalizedPhone, otp);
        System.out.println("Generated OTP for " + normalizedPhone + ": " + otp); // Debug
        return otp;
    }

    public boolean validateOtp(String phone, String otp) {
        
    	
        String normalizedPhone = phone.startsWith("+") ? phone : "+91" + phone;
        OtpEntry entry = otpStore.get(normalizedPhone);
        System.out.println("Validating OTP for " + normalizedPhone + ": " + otp);
        if (entry == null) {
            System.out.println("No OTP entry found for " + normalizedPhone);
            return false;
        }
        System.out.println("Stored OTP: " + entry.getOtp() + ", Expiry: " + entry.getExpiry() + ", Now: " + LocalDateTime.now());
        if (!entry.getOtp().equals(otp)) {
            System.out.println("OTP mismatch: Stored=" + entry.getOtp() + ", Provided=" + otp);
        }
        if (entry.getExpiry().isBefore(LocalDateTime.now())) {
            System.out.println("OTP expired: Expiry=" + entry.getExpiry() + ", Now=" + LocalDateTime.now());
        }
        if (!entry.getOtp().equals(otp) || entry.getExpiry().isBefore(LocalDateTime.now())) {
            otpStore.remove(normalizedPhone);
            return false;
        }
        otpStore.remove(normalizedPhone);
        return true;
    }

    private void sendOtpViaTwilio(String phone, String otp) {
            Twilio.init(twilioAccountSid, twilioAuthToken);
            String messageBody = "Your OTP is: " + otp + ". It expires in " + OTP_EXPIRY_MINUTES + " minutes.";
            try {
            Message.creator(
                    new PhoneNumber(phone),
                    new PhoneNumber(twilioPhoneNumber),
                    messageBody
            ).create();
            System.out.println("OTP sent to " + phone);
        } catch (ApiException e) {
            String errorMsg = e.getMessage();
            if (errorMsg.contains("unverified")) {
                throw new RuntimeException("Cannot send OTP: Number is unverified in trial mode. Verify it in Twilio Console.", e);
            } else {
                throw new RuntimeException("Failed to send OTP via Twilio: " + errorMsg, e);
            }
        }
    }

    private static class OtpEntry {
        private final String otp;
        private final LocalDateTime expiry;

        public OtpEntry(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiry() {
            return expiry;
        }
    }
}