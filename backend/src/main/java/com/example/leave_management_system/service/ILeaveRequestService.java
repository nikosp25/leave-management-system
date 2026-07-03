package com.example.leave_management_system.service;

import com.example.leave_management_system.dto.leaveRequest.LeaveRequestInsertDTO;
import com.example.leave_management_system.dto.leaveRequest.LeaveRequestReadOnlyDTO;
import com.example.leave_management_system.dto.leaveRequest.LeaveRequestUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ILeaveRequestService {
    LeaveRequestReadOnlyDTO createLeaveRequest(UUID userUuid, LeaveRequestInsertDTO dto);

    LeaveRequestReadOnlyDTO updateLeaveRequestStatus(UUID leaveUuid, LeaveRequestUpdateDTO dto);

    LeaveRequestReadOnlyDTO getLeaveRequestByUuid(UUID leaveUuid);

    Page<LeaveRequestReadOnlyDTO> getLeaveRequestsByUser(UUID userUuid, Pageable pageable);

    Page<LeaveRequestReadOnlyDTO> getAllLeaveRequests(Pageable pageable);

    Page<LeaveRequestReadOnlyDTO> getDeletedLeaveRequests(Pageable pageable);

    Page<LeaveRequestReadOnlyDTO> getLeaveRequestsByStatus(String statusName, Pageable pageable);

    List<LeaveRequestReadOnlyDTO> getApprovedLeavesForUserInYear(UUID userUuid, int year);

}
