package com.campusconnect.service;

import com.campusconnect.dto.CompanyRegisterDTO;
import com.campusconnect.dto.CompanyResponseDTO;
import com.campusconnect.entity.Company;
import com.campusconnect.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public CompanyResponseDTO register(CompanyRegisterDTO request) {

        if (companyRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Company company = new Company();
        company.setName(request.getName());
        company.setEmail(request.getEmail());
        company.setPassword(passwordEncoder.encode(request.getPassword()));
        company.setDescription(request.getDescription());
        company.setWebsite(request.getWebsite());
        company.setIndustry(request.getIndustry());
        company.setContactPerson(request.getContactPerson());
        company.setContactPhone(request.getContactPhone());
        company.setLocation(request.getLocation());

        Company saved = companyRepository.save(company);
        return toDTO(saved);
    }

    public CompanyResponseDTO getById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return toDTO(company);
    }

    private CompanyResponseDTO toDTO(Company c) {
        CompanyResponseDTO dto = new CompanyResponseDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setEmail(c.getEmail());
        dto.setDescription(c.getDescription());
        dto.setWebsite(c.getWebsite());
        dto.setIndustry(c.getIndustry());
        dto.setContactPerson(c.getContactPerson());
        dto.setContactPhone(c.getContactPhone());
        dto.setLocation(c.getLocation());
        dto.setCreatedAt(c.getCreatedAt());
        return dto;
    }
}