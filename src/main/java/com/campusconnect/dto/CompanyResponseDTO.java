package com.campusconnect.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CompanyResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String description;
    private String website;
    private String industry;
    private String contactPerson;
    private String contactPhone;
    private String location;
    private LocalDateTime createdAt;
}