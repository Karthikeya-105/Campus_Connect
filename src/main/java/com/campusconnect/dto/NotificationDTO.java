package com.campusconnect.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long id;
    private String title;
    private String message;
    private String type;
    private String linkUrl;
    private Boolean read;
    private LocalDateTime createdAt;
}