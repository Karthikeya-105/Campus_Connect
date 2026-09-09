package com.campusconnect.controller;

import com.campusconnect.dto.StudentRequestDTO;
import com.campusconnect.dto.StudentResponseDTO;
import com.campusconnect.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    ///End point for the student service
    @PostMapping("/register")
    public ResponseEntity<StudentResponseDTO> register(@Valid @RequestBody StudentRequestDTO
                                                                   request){
        StudentResponseDTO response=studentService.registerStudent(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);

    }


}
