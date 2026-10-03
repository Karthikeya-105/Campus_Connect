package com.campusconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InterviewRequestDTO {

    @NotNull(message = "Interview date/time is required")
    private LocalDateTime interviewDate;

    @NotBlank(message = "Interview mode is required")
    private String interviewMode;

    private String interviewLink;

    private String interviewNotes;
}