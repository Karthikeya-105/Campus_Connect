package com.campusconnect.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class JobPostingResponseDTO {

    private Long id;
    private Long companyId;
    private String companyName;
    private String jobTitle;
    private String description;
    private String location;
    private Double salary;
    private String requiredSkills;
    private Double minCgpa;
    private LocalDate applicationDeadline;
    private LocalDateTime postedAt;
    private String status;
}