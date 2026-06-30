package com.example.leave_management_system.dto.leaveRequest;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record LeaveRequestInsertDTO(
        @NotNull(message = "Start date is required")
        @FutureOrPresent(message = "Start date cannot be in the past")
        LocalDate startDate,

        @NotNull(message = "End date is required")
        @FutureOrPresent(message = "End date cannot be in the past")
        LocalDate endDate,

        @NotBlank(message = "Leave type is required")
        String leaveTypeName,

        @Size(max = 500, message = "Reason must not exceed 500 characters")
        String reason
) {
}
