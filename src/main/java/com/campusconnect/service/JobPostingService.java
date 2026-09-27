package com.campusconnect.service;

import com.campusconnect.dto.JobPostingRequestDTO;
import com.campusconnect.dto.JobPostingResponseDTO;
import com.campusconnect.entity.Company;
import com.campusconnect.entity.JobPosting;
import com.campusconnect.repository.CompanyRepository;
import com.campusconnect.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final CompanyRepository companyRepository;

    // 1. Create a new job — only for the authenticated company
    @Transactional
    public JobPostingResponseDTO createJob(JobPostingRequestDTO request, String companyEmail) {

        Company company = companyRepository.findByEmail(companyEmail)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        JobPosting job = new JobPosting();
        job.setCompany(company);
        job.setJobTitle(request.getJobTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setMinCgpa(request.getMinCgpa());
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setStatus("OPEN");

        JobPosting saved = jobPostingRepository.save(job);
        return toDTO(saved);
    }

    // 2. Get a single job by id
    public JobPostingResponseDTO getJobById(Long id) {
        JobPosting job = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return toDTO(job);
    }

    // 3. List all OPEN jobs — for students to browse
    public List<JobPostingResponseDTO> getActiveJobs() {
        return jobPostingRepository.findByStatus("OPEN")
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // 4. List jobs for a specific company — only if requester owns it
    public List<JobPostingResponseDTO> getJobsByCompany(Long companyId, String requesterEmail) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Security: only the owning company can view its own job list
        if (!company.getEmail().equals(requesterEmail)) {
            throw new RuntimeException("You are not authorized to view this company's jobs");
        }

        return jobPostingRepository.findByCompanyId(companyId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // 5. Reusable entity -> DTO converter
    private JobPostingResponseDTO toDTO(JobPosting job) {
        JobPostingResponseDTO dto = new JobPostingResponseDTO();
        dto.setId(job.getId());
        dto.setCompanyId(job.getCompany().getId());
        dto.setCompanyName(job.getCompany().getName());
        dto.setJobTitle(job.getJobTitle());
        dto.setDescription(job.getDescription());
        dto.setLocation(job.getLocation());
        dto.setSalary(job.getSalary());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setMinCgpa(job.getMinCgpa());
        dto.setApplicationDeadline(job.getApplicationDeadline());
        dto.setPostedAt(job.getPostedAt());
        dto.setStatus(job.getStatus());
        return dto;
    }
}