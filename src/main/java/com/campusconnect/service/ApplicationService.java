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
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobPostingRepository jobPostingRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;

    private static final DateTimeFormatter PRETTY_DATE =
            DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy 'at' h:mm a");

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

        notificationService.notify(
                job.getCompany().getEmail(),
                "COMPANY",
                "New application received",
                student.getName() + " (" + student.getEmail() + ") applied for " + job.getJobTitle(),
                "APPLICATION",
                "/company/jobs/" + job.getId() + "/applicants"
        );

        return toDTO(saved);
    }

    public List<ApplicationResponseDTO> getMyApplications(String studentEmail) {
        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return applicationRepository.findByStudentId(student.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ApplicationResponseDTO> getApplicationsForJob(Long jobId, String companyEmail) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getCompany().getEmail().equals(companyEmail)) {
            throw new RuntimeException("You are not authorized to view these applications");
        }

        return applicationRepository.findByJobPostingId(jobId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

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

        if (List.of("SHORTLISTED", "SELECTED", "REJECTED").contains(newStatus)) {
            String title = switch (newStatus) {
                case "SHORTLISTED" -> "You've been shortlisted!";
                case "SELECTED" -> "Congratulations — you've been selected!";
                case "REJECTED" -> "Application update";
                default -> "Application update";
            };
            String message = switch (newStatus) {
                case "SHORTLISTED" -> "You have been shortlisted for " + application.getJobPosting().getJobTitle()
                        + " at " + application.getJobPosting().getCompany().getName() + ".";
                case "SELECTED" -> "You have been selected for " + application.getJobPosting().getJobTitle()
                        + " at " + application.getJobPosting().getCompany().getName() + ". Congratulations!";
                case "REJECTED" -> "Your application for " + application.getJobPosting().getJobTitle()
                        + " was not moved forward. Keep applying!";
                default -> "";
            };
            notificationService.notify(
                    application.getStudent().getEmail(),
                    "STUDENT",
                    title,
                    message,
                    "STATUS_CHANGE",
                    "/applications"
            );
        }

        return toDTO(updated);
    }

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

        // Build rich HTML email for the student
        String emailHtml = buildInterviewEmailHtml(application);

        String shortMessage = "Your interview for " + application.getJobPosting().getJobTitle()
                + " at " + application.getJobPosting().getCompany().getName()
                + " is scheduled for " + request.getInterviewDate().format(PRETTY_DATE) + ".";

        notificationService.notifyWithEmail(
                application.getStudent().getEmail(),
                "STUDENT",
                "Interview scheduled",
                shortMessage,
                "INTERVIEW",
                "/applications",
                emailHtml
        );

        return toDTO(updated);
    }

    // ---------- HTML email builder ----------

    private String buildInterviewEmailHtml(Application app) {
        String jobTitle = app.getJobPosting().getJobTitle();
        String companyName = app.getJobPosting().getCompany().getName();
        String studentName = app.getStudent().getName();
        String when = app.getInterviewDate() != null
                ? app.getInterviewDate().format(PRETTY_DATE)
                : "To be announced";
        String mode = "ONLINE".equals(app.getInterviewMode()) ? "🌐 Online" : "🏢 In Person";
        String link = app.getInterviewLink() == null ? "" : app.getInterviewLink();
        String notes = app.getInterviewNotes() == null ? "" : app.getInterviewNotes();

        // Conditional block for link / venue
        String locationBlock;
        if ("ONLINE".equals(app.getInterviewMode()) && !link.isBlank()) {
            locationBlock = "<p style=\"margin:8px 0;color:#0f172a;\">"
                    + "<strong>Meeting link:</strong><br/>"
                    + "<a href=\"" + link + "\" style=\"color:#4f46e5;text-decoration:none;word-break:break-all;\">"
                    + link + "</a></p>"
                    + "<p style=\"margin:16px 0;\">"
                    + "<a href=\"" + link + "\" "
                    + "style=\"display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;"
                    + "padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;\">"
                    + "Join Interview</a></p>";
        } else if (!link.isBlank()) {
            locationBlock = "<p style=\"margin:8px 0;color:#0f172a;\">"
                    + "<strong>Venue:</strong><br/>" + link + "</p>";
        } else {
            locationBlock = "<p style=\"margin:8px 0;color:#64748b;font-style:italic;\">"
                    + "Location details will be shared separately.</p>";
        }

        String notesBlock = notes.isBlank()
                ? ""
                : "<div style=\"background:#f8fafc;border-left:4px solid #4f46e5;padding:14px 16px;"
                  + "border-radius:6px;margin-top:20px;\">"
                  + "<p style=\"margin:0;font-size:13px;color:#475569;font-weight:600;\">Notes from the recruiter</p>"
                  + "<p style=\"margin:6px 0 0;font-size:14px;color:#0f172a;line-height:1.5;\">"
                  + escapeHtml(notes) + "</p>"
                  + "</div>";

        return "<!DOCTYPE html>"
                + "<html><body style=\"margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;\">"
                + "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" "
                + "style=\"background:#f1f5f9;padding:40px 0;\">"
                + "<tr><td align=\"center\">"

                + "<table width=\"560\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" "
                + "style=\"background:#ffffff;border-radius:12px;overflow:hidden;"
                + "box-shadow:0 4px 12px rgba(15,23,42,0.08);\">"

                // Header
                + "<tr><td style=\"background:linear-gradient(135deg,#4f46e5,#4338ca);"
                + "padding:32px 32px 28px;color:#ffffff;\">"
                + "<p style=\"margin:0;font-size:13px;opacity:0.85;text-transform:uppercase;letter-spacing:1px;\">CampusConnect</p>"
                + "<h1 style=\"margin:8px 0 0;font-size:22px;font-weight:700;\">Interview Scheduled</h1>"
                + "</td></tr>"

                // Body
                + "<tr><td style=\"padding:32px;\">"
                + "<p style=\"margin:0 0 16px;font-size:15px;color:#0f172a;\">Hi " + escapeHtml(studentName) + ",</p>"
                + "<p style=\"margin:0 0 20px;font-size:15px;color:#334155;line-height:1.6;\">"
                + "Your interview for the role of <strong>" + escapeHtml(jobTitle) + "</strong> "
                + "at <strong>" + escapeHtml(companyName) + "</strong> has been scheduled. "
                + "Here are the details:</p>"

                // Details card
                + "<div style=\"background:#f8fafc;border-radius:10px;padding:20px;border:1px solid #e2e8f0;\">"
                + "<p style=\"margin:0 0 10px;color:#0f172a;font-size:14px;\">"
                + "<strong>📅 Date & Time:</strong> " + when + "</p>"
                + "<p style=\"margin:0 0 10px;color:#0f172a;font-size:14px;\">"
                + "<strong>Mode:</strong> " + mode + "</p>"
                + locationBlock
                + "</div>"

                + notesBlock

                + "<p style=\"margin:24px 0 0;font-size:13px;color:#64748b;line-height:1.6;\">"
                + "You can also view these details anytime by logging into your "
                + "CampusConnect account and visiting <strong>My Applications</strong>.</p>"

                + "<p style=\"margin:24px 0 0;font-size:14px;color:#0f172a;\">Best of luck!<br/>"
                + "<strong>The CampusConnect Team</strong></p>"
                + "</td></tr>"

                // Footer
                + "<tr><td style=\"background:#f8fafc;padding:18px 32px;text-align:center;\">"
                + "<p style=\"margin:0;font-size:11px;color:#94a3b8;\">"
                + "You received this email because you applied for a job on CampusConnect.</p>"
                + "</td></tr>"

                + "</table>"
                + "</td></tr></table></body></html>";
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }

    // ---------- Entity → DTO ----------

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