package com.telecom.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.ByteArrayInputStream;
import java.util.Base64;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendInvoiceEmail(String toEmail, String pdfBase64, String transactionId) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject("Your TelecomX Recharge Invoice - Transaction " + transactionId);
        helper.setText("Dear Customer,\n\nThank you for your recharge with TelecomX. Attached is your invoice for Transaction ID: " + transactionId + ".\n\nBest regards,\nTelecomX Team");

        // Decode Base64 PDF
        byte[] pdfBytes = Base64.getDecoder().decode(pdfBase64);

        InputStreamSource pdfSource = () -> new ByteArrayInputStream(pdfBytes);

        // Attach PDF using InputStreamSource
        helper.addAttachment("invoice_" + transactionId + ".pdf", pdfSource);

        mailSender.send(message);
    }
}