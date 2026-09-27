package com.campusconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobPostingRequestDTO {

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private String description;

    private String location;

    private Double salary;

    private String requiredSkills;

    private Double minCgpa;

    @NotNull(message = "Application deadline is required")
    private LocalDate applicationDeadline;
}