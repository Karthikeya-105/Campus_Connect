package com.campusconnect.controller;

import com.campusconnect.entity.*;
import com.campusconnect.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

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