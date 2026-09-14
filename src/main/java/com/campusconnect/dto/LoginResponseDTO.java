package com.campusconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String token;//React Saves it in the local Storage
    private Long studentId;
    private String name;
    private String email;
}
