package com.campusconnect.service;

import com.campusconnect.dto.StudentRequestDTO;
import com.campusconnect.dto.StudentResponseDTO;
import com.campusconnect.entity.Student;
import com.campusconnect.repository.StudentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    @Transactional
    public StudentResponseDTO registerStudent(StudentRequestDTO request) {
        // 1. Check if email already exists
        Optional<Student> existingStudent = studentRepository.findByEmail(request.getEmail());
        if (existingStudent.isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        // 2. Create a new Student entity
        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setRollNumber(request.getRollNumber());
        student.setBranch(request.getBranch());
        student.setCgpa(request.getCgpa());
        student.setResumeUrl(request.getResumeUrl());

        // 3. Save to database (Hibernate will auto-fill createdAt)
        Student savedStudent = studentRepository.save(student);

        // 4. Convert to Response DTO (without password!)
        StudentResponseDTO response = new StudentResponseDTO();
        response.setId(savedStudent.getId());
        response.setName(savedStudent.getName());
        response.setEmail(savedStudent.getEmail());
        response.setRollNumber(savedStudent.getRollNumber());
        response.setBranch(savedStudent.getBranch());
        response.setCgpa(savedStudent.getCgpa());
        response.setResumeUrl(savedStudent.getResumeUrl());
        response.setCreatedAt(savedStudent.getCreatedAt());

        return response;
    }

}
