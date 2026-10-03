package com.campusconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_postings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many job postings belong to one company.
    // LAZY fetch: don't load the company object unless we explicitly need it.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    private Double salary;

    @Column(name = "required_skills")
    private String requiredSkills;

    @Column(name = "min_cgpa")
    private Double minCgpa;

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @CreationTimestamp
    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @Column(nullable = false)
    private String status = "OPEN";
}