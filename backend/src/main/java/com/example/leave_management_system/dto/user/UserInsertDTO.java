package com.example.leave_management_system.dto.user;

import jakarta.validation.constraints.*;

public record UserInsertDTO(
        @NotBlank(message = "First name is required")
        @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email address")
        String email,

        @NotBlank(message = "Role is required")
        String roleName,

        @NotNull(message = "Password is required")
        @Pattern(
                regexp = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=])^.{8,}$",
                message = "Password must be at least 8 characters long and contain at least one digit, one lowercase letter, one uppercase letter, and one special character"
        )
        String password
) {
}
