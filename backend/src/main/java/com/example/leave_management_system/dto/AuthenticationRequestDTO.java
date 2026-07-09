package com.example.leave_management_system.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthenticationRequestDTO(

        @NotBlank(message = "Email is required")
        @Email(message = "Format must be a valid email address")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {}
