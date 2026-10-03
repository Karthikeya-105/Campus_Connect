package com.campusconnect.service;

import com.campusconnect.dto.AdminLoginRequestDTO;
import com.campusconnect.dto.AdminLoginResponseDTO;
import com.campusconnect.entity.Admin;
import com.campusconnect.repository.AdminRepository;
import com.campusconnect.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    public AdminLoginResponseDTO login(AdminLoginRequestDTO request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(admin.getEmail(), "ADMIN");

        AdminLoginResponseDTO response = new AdminLoginResponseDTO();
        response.setToken(token);
        response.setAdminId(admin.getId());
        response.setName(admin.getName());
        response.setEmail(admin.getEmail());
        return response;
    }
}