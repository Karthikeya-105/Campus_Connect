package com.campusconnect.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${spring.mail.username:noreply@campusconnect.com}")
    private String fromAddress;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Async
    public void send(String to, String subject, String body) {
        if (!emailEnabled) {
            System.out.println(">>> EMAIL DISABLED — would have sent to " + to + ": " + subject);
            return;
        }
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            System.out.println(">>> EMAIL CONFIG MISSING — would have sent to " + to);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println(">>> EMAIL SENT to " + to + ": " + subject);
        } catch (Exception e) {
            System.err.println(">>> Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    @Async
    public void sendHtml(String to, String subject, String htmlBody) {
        if (!emailEnabled) {
            System.out.println(">>> EMAIL DISABLED — would have sent HTML to " + to + ": " + subject);
            return;
        }
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            System.out.println(">>> EMAIL CONFIG MISSING — would have sent HTML to " + to);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println(">>> HTML EMAIL SENT to " + to + ": " + subject);
        } catch (Exception e) {
            System.err.println(">>> Failed to send HTML email to " + to + ": " + e.getMessage());
        }
    }
}