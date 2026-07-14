package com.example.leave_management_system.mapper;

import com.example.leave_management_system.dto.leaveRequest.LeaveRequestInsertDTO;
import com.example.leave_management_system.dto.leaveRequest.LeaveRequestReadOnlyDTO;
import com.example.leave_management_system.model.LeaveRequest;
import com.example.leave_management_system.model.LeaveStatus;
import com.example.leave_management_system.model.LeaveType;
import com.example.leave_management_system.model.User;
import org.springframework.stereotype.Component;

@Component
public class LeaveRequestMapper {
    public LeaveRequestReadOnlyDTO toReadOnlyDTO(LeaveRequest entity) {
        if (entity == null) {
            return null;
        }

        String fullName = (entity.getUser() != null)
                ? entity.getUser().getFirstName() + " " + entity.getUser().getLastName()
                : null;

        return new LeaveRequestReadOnlyDTO(
                entity.getUuid(),
                fullName,
                entity.getLeaveType() != null ? entity.getLeaveType().getName() : null,
                entity.getLeaveStatus() != null ? entity.getLeaveStatus().getName() : null,
                entity.getStartDate(),
                entity.getEndDate(),
                entity.getReason(),
                entity.getManagerComment()
        );
    }

    public LeaveRequest toEntity(LeaveRequestInsertDTO dto, User user, LeaveType leaveType, LeaveStatus leaveStatus) {
        if (dto == null) {
            return null;
        }

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setStartDate(dto.startDate());
        leaveRequest.setEndDate(dto.endDate());
        leaveRequest.setReason(dto.reason());

        leaveRequest.setUser(user);
        leaveRequest.setLeaveType(leaveType);
        leaveRequest.setLeaveStatus(leaveStatus);

        return leaveRequest;
    }
}
