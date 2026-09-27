package com.campusconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyLoginResponseDTO {
    private String token;
    private Long companyId;
    private String name;
    private String email;
}