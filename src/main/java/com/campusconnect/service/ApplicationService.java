package com.campusconnect.service;

import com.campusconnect.dto.ApplicationRequestDTO;
import com.campusconnect.dto.ApplicationResponseDTO;
import com.campusconnect.entity.Application;
import com.campusconnect.entity.JobPosting;
import com.campusconnect.entity.Student;
import com.campusconnect.repository.ApplicationRepository;
import com.campusconnect.repository.JobPostingRepository;
import com.campusconnect.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobPostingRepository jobPostingRepository;
    private final StudentRepository studentRepository;

    // 1. Student applies to a job
    @Transactional
    public ApplicationResponseDTO apply(ApplicationRequestDTO request, String studentEmail) {

        // Find the student from the JWT email
        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Find the job
        JobPosting job = jobPostingRepository.findById(request.getJobPostingId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Rule 1: job must be OPEN
        if (!"OPEN".equals(job.getStatus())) {
            throw new RuntimeException("This job is no longer accepting applications");
        }

        // Rule 2: deadline must not have passed
        if (job.getApplicationDeadline() != null
                && job.getApplicationDeadline().isBefore(LocalDate.now())) {
            throw new RuntimeException("The application deadline has passed");
        }

        // Rule 3: student must meet the minimum CGPA
        if (job.getMinCgpa() != null
                && student.getCgpa() != null
                && student.getCgpa() < job.getMinCgpa()) {
            throw new RuntimeException("You do not meet the minimum CGPA requirement");
        }

        // Rule 4: no duplicate applications
        if (applicationRepository.findByStudentIdAndJobPostingId(student.getId(), job.getId()).isPresent()) {
            throw new RuntimeException("You have already applied to this job");
        }

        // Create and save
        Application application = new Application();
        application.setStudent(student);
        application.setJobPosting(job);
        application.setStatus("APPLIED");

        Application saved = applicationRepository.save(application);
        return toDTO(saved);
    }

    // 2. All applications by the logged-in student
    public List<ApplicationResponseDTO> getMyApplications(String studentEmail) {
        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return applicationRepository.findByStudentId(student.getId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // 3. All applications for a job (company view)
    public List<ApplicationResponseDTO> getApplicationsForJob(Long jobId, String companyEmail) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Security: only the company that owns this job can see its applicants
        if (!job.getCompany().getEmail().equals(companyEmail)) {
            throw new RuntimeException("You are not authorized to view these applications");
        }

        return applicationRepository.findByJobPostingId(jobId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // 4. Update application status (shortlist / reject / select)
    @Transactional
    public ApplicationResponseDTO updateStatus(Long applicationId, String newStatus, String companyEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Security: only the owning company can update the status
        if (!application.getJobPosting().getCompany().getEmail().equals(companyEmail)) {
            throw new RuntimeException("You are not authorized to modify this application");
        }

        // Validate the new status value
        if (!List.of("APPLIED", "SHORTLISTED", "REJECTED", "SELECTED").contains(newStatus)) {
            throw new RuntimeException("Invalid status: " + newStatus);
        }

        application.setStatus(newStatus);
        Application updated = applicationRepository.save(application);
        return toDTO(updated);
    }

    // 5. Entity → DTO converter
    private ApplicationResponseDTO toDTO(Application app) {
        ApplicationResponseDTO dto = new ApplicationResponseDTO();
        dto.setId(app.getId());
        dto.setStatus(app.getStatus());
        dto.setAppliedAt(app.getAppliedAt());

        // Job info
        JobPosting job = app.getJobPosting();
        dto.setJobPostingId(job.getId());
        dto.setJobTitle(job.getJobTitle());
        dto.setCompanyName(job.getCompany().getName());

        // Student info
        Student student = app.getStudent();
        dto.setStudentId(student.getId());
        dto.setStudentName(student.getName());
        dto.setStudentEmail(student.getEmail());
        dto.setStudentRollNumber(student.getRollNumber());
        dto.setStudentBranch(student.getBranch());
        dto.setStudentCgpa(student.getCgpa());
        dto.setStudentResumeUrl(student.getResumeUrl());

        return dto;
    }
}