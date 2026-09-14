package com.campusconnect.service;

import com.campusconnect.dto.LoginRequestDTO;
import com.campusconnect.dto.LoginResponseDTO;
import com.campusconnect.entity.Student;
import com.campusconnect.repository.StudentRepository;
import com.campusconnect.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO request) {

        // 1. Find the student by email
        Student student = studentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // 2. Verify the password using BCrypt
        if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 3. Generate a JWT
        String token = jwtUtil.generateToken(student.getEmail());

        // 4. Build and return the response DTO
        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setStudentId(student.getId());
        response.setName(student.getName());
        response.setEmail(student.getEmail());
        return response;
    }
}