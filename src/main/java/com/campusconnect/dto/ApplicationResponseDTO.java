package com.campusconnect.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApplicationResponseDTO {
    private Long id;
    private Long jobPostingId;
    private String jobTitle;
    private String companyName;
    private String status;
    private LocalDateTime appliedAt;

    // Student fields — only used when a company views applicants
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentRollNumber;
    private String studentBranch;
    private Double studentCgpa;
    private String studentResumeUrl;
}