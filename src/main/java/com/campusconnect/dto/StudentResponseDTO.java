package com.campusconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponseDTO {
    private Long id;

    private  String name;

    private String email;

    private String rollNumber;

    private String branch;

    private Double cgpa;

    private String resumeUrl;

    private LocalDateTime createdAt;
}
