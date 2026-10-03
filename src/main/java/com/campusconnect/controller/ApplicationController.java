package com.campusconnect.controller;

import com.campusconnect.dto.ApplicationRequestDTO;
import com.campusconnect.dto.ApplicationResponseDTO;
import com.campusconnect.dto.InterviewRequestDTO;
import com.campusconnect.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationResponseDTO> apply(
            @Valid @RequestBody ApplicationRequestDTO request,
            Authentication authentication) {

        ApplicationResponseDTO created = applicationService.apply(request, authentication.getName());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<List<ApplicationResponseDTO>> getMyApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getMyApplications(authentication.getName()));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponseDTO>> getApplicationsForJob(
            @PathVariable Long jobId,
            Authentication authentication) {

        return ResponseEntity.ok(
                applicationService.getApplicationsForJob(jobId, authentication.getName()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {

        String newStatus = body.get("status");
        ApplicationResponseDTO updated = applicationService.updateStatus(id, newStatus, authentication.getName());
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/interview")
    public ResponseEntity<ApplicationResponseDTO> scheduleInterview(
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequestDTO request,
            Authentication authentication) {

        ApplicationResponseDTO updated = applicationService.scheduleInterview(
                id, request, authentication.getName());
        return ResponseEntity.ok(updated);
    }
}