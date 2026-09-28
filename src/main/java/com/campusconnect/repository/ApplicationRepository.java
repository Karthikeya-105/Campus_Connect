package com.campusconnect.repository;

import com.campusconnect.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // All applications by a student (for their "My Applications" page)
    List<Application> findByStudentId(Long studentId);

    // All applications for a job (for the company's "View Applicants" page)
    List<Application> findByJobPostingId(Long jobPostingId);

    // Check if a student already applied to a job (prevent duplicates)
    Optional<Application> findByStudentIdAndJobPostingId(Long studentId, Long jobPostingId);
}