package com.campusconnect.repository;

import com.campusconnect.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

    // Spring reads "findByCompanyId" and generates:
    // SELECT * FROM job_postings WHERE company_id = ?
    List<JobPosting> findByCompanyId(Long companyId);

    // Same idea: SELECT * FROM job_postings WHERE status = ?
    List<JobPosting> findByStatus(String status);
}