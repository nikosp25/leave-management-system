package com.example.leave_management_system.dto.leaveRequest;

import java.time.LocalDate;

public record LeaveRequestReadOnlyDTO(
        Long id,
        String userFullName,
        String leaveTypeName,
        String leaveStatusName,
        LocalDate startDate,
        LocalDate endDate,
        String reason
) {
}
