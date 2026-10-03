package com.campusconnect.controller;

import com.campusconnect.entity.*;
import com.campusconnect.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.campusconnect.service.AnalyticsService;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AnalyticsService analyticsService;

// ... existing endpoints ...

    @GetMapping("/analytics/jobs-per-month")
    public ResponseEntity<List<Map<String, Object>>> jobsPerMonth() {
        return ResponseEntity.ok(analyticsService.jobsPerMonth());
    }

    @GetMapping("/analytics/applications-by-status")
    public ResponseEntity<List<Map<String, Object>>> applicationsByStatus() {
        return ResponseEntity.ok(analyticsService.applicationsByStatus());
    }

    @GetMapping("/analytics/top-companies")
    public ResponseEntity<List<Map<String, Object>>> topCompanies() {
        return ResponseEntity.ok(analyticsService.topCompanies(5));
    }

    @GetMapping("/analytics/branch-placement")
    public ResponseEntity<List<Map<String, Object>>> branchPlacement() {
        return ResponseEntity.ok(analyticsService.branchPlacement());
    }

    @GetMapping("/analytics/applications-over-time")
    public ResponseEntity<List<Map<String, Object>>> applicationsOverTime() {
        return ResponseEntity.ok(analyticsService.applicationsOverTime());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> stats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/placement-stats")
    public ResponseEntity<Map<String, Object>> placementStats() {
        return ResponseEntity.ok(adminService.getPlacementStats());
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> students() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> companies() {
        return ResponseEntity.ok(adminService.getAllCompanies());
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobPosting>> jobs() {
        return ResponseEntity.ok(adminService.getAllJobs());
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Application>> applications() {
        return ResponseEntity.ok(adminService.getAllApplications());
    }
}