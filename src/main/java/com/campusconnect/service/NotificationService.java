package com.campusconnect.service;

import com.campusconnect.dto.NotificationDTO;
import com.campusconnect.entity.Notification;
import com.campusconnect.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    // Plain-text notification (existing method — used for apply/shortlist/select/reject)
    @Transactional
    public void notify(String recipientEmail, String recipientRole, String title,
                       String message, String type, String linkUrl) {
        saveNotification(recipientEmail, recipientRole, title, message, type, linkUrl);
        emailService.send(recipientEmail, title, message);
    }

    // HTML notification — used when we want a richer email (e.g., interview details)
    @Transactional
    public void notifyWithEmail(String recipientEmail, String recipientRole, String title,
                                String message, String type, String linkUrl, String htmlEmailBody) {
        saveNotification(recipientEmail, recipientRole, title, message, type, linkUrl);
        emailService.sendHtml(recipientEmail, title, htmlEmailBody);
    }

    private void saveNotification(String recipientEmail, String recipientRole, String title,
                                  String message, String type, String linkUrl) {
        Notification n = new Notification();
        n.setRecipientEmail(recipientEmail);
        n.setRecipientRole(recipientRole);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        n.setLinkUrl(linkUrl);
        n.setRead(false);
        notificationRepository.save(n);
    }

    public List<NotificationDTO> getMyNotifications(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<NotificationDTO> getRecent(String email) {
        return notificationRepository.findTop10ByRecipientEmailOrderByCreatedAtDesc(email)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndReadFalse(email);
    }

    @Transactional
    public void markAsRead(Long id, String email) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!n.getRecipientEmail().equals(email)) {
            throw new RuntimeException("Not authorized");
        }
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllRead(String email) {
        List<Notification> all = notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
        for (Notification n : all) {
            if (!n.getRead()) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        }
    }

    private NotificationDTO toDTO(Notification n) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(n.getId());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setType(n.getType());
        dto.setLinkUrl(n.getLinkUrl());
        dto.setRead(n.getRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}