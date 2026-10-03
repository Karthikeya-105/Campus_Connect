package com.campusconnect.repository;

import com.campusconnect.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);

    long countByRecipientEmailAndReadFalse(String recipientEmail);

    List<Notification> findTop10ByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
}