package com.campusconnect.service;

import com.campusconnect.dto.CompanyLoginRequestDTO;
import com.campusconnect.dto.CompanyLoginResponseDTO;
import com.campusconnect.entity.Company;
import com.campusconnect.repository.CompanyRepository;
import com.campusconnect.util.JWTUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyAuthService {

    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    public CompanyLoginResponseDTO login(CompanyLoginRequestDTO request) {

        // 1. Find company by email
        Company company = companyRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // 2. Verify password
        if (!passwordEncoder.matches(request.getPassword(), company.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 3. Generate JWT with COMPANY role
        String token = jwtUtil.generateToken(company.getEmail(), "COMPANY");

        // 4. Build response
        CompanyLoginResponseDTO response = new CompanyLoginResponseDTO();
        response.setToken(token);
        response.setCompanyId(company.getId());
        response.setName(company.getName());
        response.setEmail(company.getEmail());
        return response;
    }
}