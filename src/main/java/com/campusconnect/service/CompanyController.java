package com.campusconnect.controller;

import com.campusconnect.dto.CompanyRegisterDTO;
import com.campusconnect.dto.CompanyResponseDTO;
import com.campusconnect.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping("/register")
    public ResponseEntity<CompanyResponseDTO> register(@Valid @RequestBody CompanyRegisterDTO request) {
        CompanyResponseDTO created = companyService.register(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getById(id));
    }
}