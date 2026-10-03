package com.campusconnect.service;

import com.campusconnect.dto.ApplicationRequestDTO;
import com.campusconnect.dto.ApplicationResponseDTO;
import com.campusconnect.dto.InterviewRequestDTO;
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

        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        JobPosting job = jobPostingRepository.findById(request.getJobPostingId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!"OPEN".equals(job.getStatus())) {
            throw new RuntimeException("This job is no longer accepting applications");
        }
        if (job.getApplicationDeadline() != null
                && job.getApplicationDeadline().isBefore(LocalDate.now())) {
            throw new RuntimeException("The application deadline has passed");
        }
        if (job.getMinCgpa() != null
                && student.getCgpa() != null
                && student.getCgpa() < job.getMinCgpa()) {
            throw new RuntimeException("You do not meet the minimum CGPA requirement");
        }
        if (applicationRepository.findByStudentIdAndJobPostingId(student.getId(), job.getId()).isPresent()) {
            throw new RuntimeException("You have already applied to this job");
        }

        Application application = new Application();
        application.setStudent(student);
        application.setJobPosting(job);
        application.setStatus("APPLIED");

        Application saved = applicationRepository.save(application);
        return toDTO(saved);
    }

    // 2. Student's own applications
    public List<ApplicationResponseDTO> getMyApplications(String studentEmail) {
        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return applicationRepository.findByStudentId(student.getId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // 3. Company views applicants for a job
    public List<ApplicationResponseDTO> getApplicationsForJob(Long jobId, String companyEmail) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getCompany().getEmail().equals(companyEmail)) {
            throw new RuntimeException("You are not authorized to view these applications");
        }

        return applicationRepository.findByJobPostingId(jobId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // 4. Update application status
    @Transactional
    public ApplicationResponseDTO updateStatus(Long applicationId, String newStatus, String companyEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJobPosting().getCompany().getEmail().equals(companyEmail)) {
            throw new RuntimeException("You are not authorized to modify this application");
        }

        if (!List.of("APPLIED", "SHORTLISTED", "REJECTED", "SELECTED").contains(newStatus)) {
            throw new RuntimeException("Invalid status: " + newStatus);
        }

        application.setStatus(newStatus);
        Application updated = applicationRepository.save(application);
        return toDTO(updated);
    }

    // 5. Company schedules an interview
    @Transactional
    public ApplicationResponseDTO scheduleInterview(Long applicationId, InterviewRequestDTO request, String companyEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJobPosting().getCompany().getEmail().equals(companyEmail)) {
            throw new RuntimeException("You are not authorized to schedule this interview");
        }

        if (!List.of("SHORTLISTED", "SELECTED").contains(application.getStatus())) {
            throw new RuntimeException("Interview can only be scheduled for shortlisted or selected applicants");
        }

        if (!List.of("ONLINE", "IN_PERSON").contains(request.getInterviewMode())) {
            throw new RuntimeException("Interview mode must be ONLINE or IN_PERSON");
        }

        if (request.getInterviewDate().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Interview date must be in the future");
        }

        application.setInterviewDate(request.getInterviewDate());
        application.setInterviewMode(request.getInterviewMode());
        application.setInterviewLink(request.getInterviewLink());
        application.setInterviewNotes(request.getInterviewNotes());

        Application updated = applicationRepository.save(application);
        return toDTO(updated);
    }

    // 6. Entity → DTO
    private ApplicationResponseDTO toDTO(Application app) {
        ApplicationResponseDTO dto = new ApplicationResponseDTO();
        dto.setId(app.getId());
        dto.setStatus(app.getStatus());
        dto.setAppliedAt(app.getAppliedAt());

        JobPosting job = app.getJobPosting();
        dto.setJobPostingId(job.getId());
        dto.setJobTitle(job.getJobTitle());
        dto.setCompanyName(job.getCompany().getName());

        Student student = app.getStudent();
        dto.setStudentId(student.getId());
        dto.setStudentName(student.getName());
        dto.setStudentEmail(student.getEmail());
        dto.setStudentRollNumber(student.getRollNumber());
        dto.setStudentBranch(student.getBranch());
        dto.setStudentCgpa(student.getCgpa());
        dto.setStudentResumeUrl(student.getResumeUrl());

        dto.setInterviewDate(app.getInterviewDate());
        dto.setInterviewMode(app.getInterviewMode());
        dto.setInterviewLink(app.getInterviewLink());
        dto.setInterviewNotes(app.getInterviewNotes());

        return dto;
    }
}