package com.campusconnect.service;

import com.campusconnect.entity.Application;
import com.campusconnect.entity.JobPosting;
import com.campusconnect.repository.ApplicationRepository;
import com.campusconnect.repository.JobPostingRepository;
import com.campusconnect.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;

    private static final DateTimeFormatter MONTH_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM");

    /**
     * Jobs posted per month, last 6 months.
     * Returns [{ month: "2026-05", count: 3 }, ...]
     */
    public List<Map<String, Object>> jobsPerMonth() {
        List<JobPosting> jobs = jobPostingRepository.findAll();

        // Group by YearMonth
        Map<YearMonth, Long> grouped = jobs.stream()
                .filter(j -> j.getPostedAt() != null)
                .collect(Collectors.groupingBy(
                        j -> YearMonth.from(j.getPostedAt()),
                        Collectors.counting()
                ));

        // Build last 6 months including zeros
        List<Map<String, Object>> result = new ArrayList<>();
        YearMonth now = YearMonth.now();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = now.minusMonths(i);
            result.add(Map.of(
                    "month", ym.format(MONTH_FORMAT),
                    "count", grouped.getOrDefault(ym, 0L)
            ));
        }
        return result;
    }

    /**
     * Application count grouped by status.
     * Returns [{ status: "APPLIED", count: 5 }, ...]
     */
    public List<Map<String, Object>> applicationsByStatus() {
        List<Application> apps = applicationRepository.findAll();
        Map<String, Long> grouped = apps.stream()
                .collect(Collectors.groupingBy(Application::getStatus, Collectors.counting()));

        // Ensure all four statuses appear, in a stable order
        List<String> order = List.of("APPLIED", "SHORTLISTED", "SELECTED", "REJECTED");
        List<Map<String, Object>> result = new ArrayList<>();
        for (String status : order) {
            result.add(Map.of(
                    "status", status,
                    "count", grouped.getOrDefault(status, 0L)
            ));
        }
        return result;
    }

    /**
     * Top N companies by total applications received.
     * Returns [{ company: "TechNova", count: 12 }, ...]
     */
    public List<Map<String, Object>> topCompanies(int limit) {
        List<Application> apps = applicationRepository.findAll();

        Map<String, Long> grouped = apps.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getJobPosting().getCompany().getName(),
                        Collectors.counting()
                ));

        return grouped.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .map(e -> Map.<String, Object>of(
                        "company", e.getKey(),
                        "count", e.getValue()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Branch-wise placement: total applications vs selected.
     * Returns [{ branch: "CSE", total: 10, selected: 3 }, ...]
     */
    public List<Map<String, Object>> branchPlacement() {
        List<Application> apps = applicationRepository.findAll();

        Map<String, Long> totalByBranch = new HashMap<>();
        Map<String, Long> selectedByBranch = new HashMap<>();

        for (Application a : apps) {
            String branch = a.getStudent().getBranch();
            if (branch == null || branch.isBlank()) branch = "Unknown";

            totalByBranch.merge(branch, 1L, Long::sum);
            if ("SELECTED".equals(a.getStatus())) {
                selectedByBranch.merge(branch, 1L, Long::sum);
            }
        }

        Set<String> branches = new TreeSet<>();
        branches.addAll(totalByBranch.keySet());
        branches.addAll(selectedByBranch.keySet());

        List<Map<String, Object>> result = new ArrayList<>();
        for (String b : branches) {
            result.add(Map.of(
                    "branch", b,
                    "total", totalByBranch.getOrDefault(b, 0L),
                    "selected", selectedByBranch.getOrDefault(b, 0L)
            ));
        }
        return result;
    }

    /**
     * Applications over the last 14 days.
     * Returns [{ date: "2026-09-20", count: 2 }, ...]
     */
    public List<Map<String, Object>> applicationsOverTime() {
        List<Application> apps = applicationRepository.findAll();

        Map<String, Long> grouped = apps.stream()
                .filter(a -> a.getAppliedAt() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getAppliedAt().toLocalDate().toString(),
                        Collectors.counting()
                ));

        List<Map<String, Object>> result = new ArrayList<>();
        java.time.LocalDate today = java.time.LocalDate.now();
        for (int i = 13; i >= 0; i--) {
            String date = today.minusDays(i).toString();
            result.add(Map.of(
                    "date", date,
                    "count", grouped.getOrDefault(date, 0L)
            ));
        }
        return result;
    }
}