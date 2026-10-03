package com.campusconnect.service;

import com.campusconnect.entity.*;
import com.campusconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public List<JobPosting> getAllJobs() {
        return jobPostingRepository.findAll();
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalCompanies", companyRepository.count());
        stats.put("totalJobs", jobPostingRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        return stats;
    }

    public Map<String, Object> getPlacementStats() {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Application> all = applicationRepository.findAll();

        long applied = all.size();
        long shortlisted = all.stream().filter(a -> "SHORTLISTED".equals(a.getStatus())).count();
        long selected = all.stream().filter(a -> "SELECTED".equals(a.getStatus())).count();
        long rejected = all.stream().filter(a -> "REJECTED".equals(a.getStatus())).count();

        double placementRate = applied == 0 ? 0.0
                : Math.round((selected * 100.0 / applied) * 100.0) / 100.0;

        result.put("applied", applied);
        result.put("shortlisted", shortlisted);
        result.put("selected", selected);
        result.put("rejected", rejected);
        result.put("placementRate", placementRate);
        return result;
    }
}