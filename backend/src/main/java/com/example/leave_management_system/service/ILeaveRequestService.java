package com.example.leave_management_system.service;

import com.example.leave_management_system.dto.leaveRequest.LeaveRequestInsertDTO;
import com.example.leave_management_system.dto.leaveRequest.LeaveRequestReadOnlyDTO;
import com.example.leave_management_system.dto.leaveRequest.LeaveRequestUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ILeaveRequestService {

    /**
     * Creates a pending leave request for the authenticated user.
     * Prevents requests for another user, overlapping dates,
     * invalid date ranges, and requests exceeding the available balance.
     */
    LeaveRequestReadOnlyDTO createLeaveRequest(UUID userUuid, LeaveRequestInsertDTO dto, String userEmail);

    /**
     * Approves or rejects a leave request and updates the user's leave balance.
     * Rejected and cancelled requests cannot be changed again.
     */
    LeaveRequestReadOnlyDTO updateLeaveRequestStatus(UUID leaveUuid, LeaveRequestUpdateDTO dto);

    LeaveRequestReadOnlyDTO getLeaveRequestByUuid(UUID leaveUuid);

    /**
     * Returns a user's leave requests.
     * Users may view their own requests, while users with READ_ALL_LEAVE
     * may view requests belonging to anyone.
     */
    Page<LeaveRequestReadOnlyDTO> getLeaveRequestsByUser(UUID userUuid, String userEmail, boolean canReadAll, Pageable pageable);

    Page<LeaveRequestReadOnlyDTO> getAllLeaveRequests(Pageable pageable);

    Page<LeaveRequestReadOnlyDTO> getDeletedLeaveRequests(Pageable pageable);

    Page<LeaveRequestReadOnlyDTO> getLeaveRequestsByStatus(String statusName, Pageable pageable);

    /**
     * Returns the approved leave requests for a user in a specific year.
     * Access is limited to the owner unless the authenticated user
     * has permission to view all leave requests.
     */
    List<LeaveRequestReadOnlyDTO> getApprovedLeavesForUserInYear(UUID userUuid, int year, String userEmail, boolean canReadAll);

    /**
     * Cancels a future pending or approved leave request owned by the
     * authenticated user. Restores the leave balance if it was approved.
     */
    LeaveRequestReadOnlyDTO cancelOwnLeave(UUID leaveUuid, String userEmail);

    /**
     * Cancels a future approved leave request selected by an authorized
     * manager or administrator. Restores the employee's leave balance.
     */
    LeaveRequestReadOnlyDTO cancelApprovedLeave(
            UUID leaveUuid
    );

}
