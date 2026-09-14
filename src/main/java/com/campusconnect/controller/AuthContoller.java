package com.campusconnect.controller;

import com.campusconnect.dto.LoginRequestDTO;
import com.campusconnect.dto.LoginResponseDTO;
import com.campusconnect.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthContoller {
    private final AuthService authService;
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request){
        LoginResponseDTO response=authService.login(request);
        return ResponseEntity.ok(response);
    }

}
