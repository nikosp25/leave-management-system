package com.example.leave_management_system.dto.leaveRequest;

import java.time.LocalDate;
import java.util.UUID;

public record LeaveRequestReadOnlyDTO(
        UUID uuid,
        String userFullName,
        String leaveTypeName,
        String leaveStatusName,
        LocalDate startDate,
        LocalDate endDate,
        String reason,
        String managerComment
) {
}
