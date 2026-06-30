package com.example.leave_management_system.dto.leaveRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LeaveRequestUpdateDTO(
        @NotBlank(message = "Leave status is required")
        String leaveStatusName,

        @Size(max = 500, message = " Comment must not exceed 500 characters")
        String comment
) {
}
