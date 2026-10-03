package com.campusconnect.controller;

import com.campusconnect.dto.AdminLoginRequestDTO;
import com.campusconnect.dto.AdminLoginResponseDTO;
import com.campusconnect.service.AdminAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponseDTO> login(@Valid @RequestBody AdminLoginRequestDTO request) {
        return ResponseEntity.ok(adminAuthService.login(request));
    }
}