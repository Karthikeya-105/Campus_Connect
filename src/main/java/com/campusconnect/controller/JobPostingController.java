package com.campusconnect.controller;

import com.campusconnect.dto.JobPostingRequestDTO;
import com.campusconnect.dto.JobPostingResponseDTO;
import com.campusconnect.service.JobPostingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    // 1. Create a new job — only the authenticated company
    @PostMapping
    public ResponseEntity<JobPostingResponseDTO> createJob(
            @Valid @RequestBody JobPostingRequestDTO request,
            Authentication authentication) {

        String companyEmail = authentication.getName();
        JobPostingResponseDTO created = jobPostingService.createJob(request, companyEmail);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // 2. View one job — public
    @GetMapping("/{id}")
    public ResponseEntity<JobPostingResponseDTO> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobPostingService.getJobById(id));
    }

    // 3. List all open jobs — public
    @GetMapping("/active")
    public ResponseEntity<List<JobPostingResponseDTO>> getActiveJobs() {
        return ResponseEntity.ok(jobPostingService.getActiveJobs());
    }

    // 4. A company's own jobs — only the owning company
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobPostingResponseDTO>> getJobsByCompany(
            @PathVariable Long companyId,
            Authentication authentication) {

        String requesterEmail = authentication.getName();
        List<JobPostingResponseDTO> jobs = jobPostingService.getJobsByCompany(companyId, requesterEmail);
        return ResponseEntity.ok(jobs);
    }
}