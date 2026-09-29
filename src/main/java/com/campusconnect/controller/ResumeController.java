package com.campusconnect.controller;

import com.campusconnect.entity.Application;
import com.campusconnect.entity.JobPosting;
import com.campusconnect.entity.Student;
import com.campusconnect.repository.ApplicationRepository;
import com.campusconnect.repository.JobPostingRepository;
import com.campusconnect.repository.StudentRepository;
import com.campusconnect.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.apache.tika.exception.TikaException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final StudentRepository studentRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;

    // 1. Student uploads a PDF
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws IOException {

        Student student = studentRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        String filename = resumeService.saveResume(file, student.getId());

        student.setResumeUrl(filename);
        studentRepository.save(student);

        return ResponseEntity.ok(Map.of(
                "message", "Resume uploaded successfully",
                "resumeUrl", filename
        ));
    }

    // 2. Serve the PDF
    @GetMapping("/view/{filename}")
    public ResponseEntity<Resource> viewResume(@PathVariable String filename) throws IOException {
        Path filePath = resumeService.resolveResumePath(filename);
        if (filePath == null || !Files.exists(filePath)) {
            throw new RuntimeException("Resume file not found");
        }

        Resource resource = new UrlResource(filePath.toUri());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    // 3. Student checks their ATS score against a job
    @PostMapping("/ats-score/{jobId}")
    public ResponseEntity<Map<String, Object>> atsScore(
            @PathVariable Long jobId,
            Authentication authentication) throws IOException, TikaException {

        Student student = studentRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getResumeUrl() == null || student.getResumeUrl().isEmpty()) {
            throw new RuntimeException("Please upload a resume first");
        }

        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        String jobText = buildJobText(job);
        String resumeText = resumeService.extractText(student.getResumeUrl());

        Map<String, Object> result = resumeService.computeAtsScore(resumeText, jobText);
        result.put("jobId", jobId);
        result.put("jobTitle", job.getJobTitle());
        return ResponseEntity.ok(result);
    }

    // 4. Company checks ATS score for a specific application
    @PostMapping("/ats-score-company/{applicationId}")
    public ResponseEntity<Map<String, Object>> atsScoreForCompany(
            @PathVariable Long applicationId,
            Authentication authentication) throws IOException, TikaException {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        String requesterEmail = authentication.getName();
        if (!application.getJobPosting().getCompany().getEmail().equals(requesterEmail)) {
            throw new RuntimeException("You are not authorized to view this application");
        }

        String resumeUrl = application.getStudent().getResumeUrl();
        if (resumeUrl == null || resumeUrl.isEmpty()) {
            throw new RuntimeException("This student has not uploaded a resume");
        }

        JobPosting job = application.getJobPosting();
        String jobText = buildJobText(job);
        String resumeText = resumeService.extractText(resumeUrl);

        Map<String, Object> result = resumeService.computeAtsScore(resumeText, jobText);
        result.put("applicationId", applicationId);
        result.put("studentName", application.getStudent().getName());
        result.put("jobTitle", job.getJobTitle());
        return ResponseEntity.ok(result);
    }

    // Helper
    private String buildJobText(JobPosting job) {
        return String.join(" ",
                job.getJobTitle() == null ? "" : job.getJobTitle(),
                job.getDescription() == null ? "" : job.getDescription(),
                job.getRequiredSkills() == null ? "" : job.getRequiredSkills()
        );
    }
}