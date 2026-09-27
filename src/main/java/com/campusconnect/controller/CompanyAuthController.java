package com.campusconnect.controller;

import com.campusconnect.dto.CompanyLoginRequestDTO;
import com.campusconnect.dto.CompanyLoginResponseDTO;
import com.campusconnect.service.CompanyAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/company")
@RequiredArgsConstructor
public class CompanyAuthController {

    private final CompanyAuthService companyAuthService;

    @PostMapping("/login")
    public ResponseEntity<CompanyLoginResponseDTO> login(@Valid @RequestBody CompanyLoginRequestDTO request) {
        return ResponseEntity.ok(companyAuthService.login(request));
    }
}