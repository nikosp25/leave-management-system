package com.example.leave_management_system.controller;


import com.example.leave_management_system.dto.leaveRequest.LeaveRequestInsertDTO;
import com.example.leave_management_system.dto.leaveRequest.LeaveRequestReadOnlyDTO;
import com.example.leave_management_system.dto.leaveRequest.LeaveRequestUpdateDTO;
import com.example.leave_management_system.service.ILeaveRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leave-requests")
@RequiredArgsConstructor
@Tag(name = "Leave Requests", description = "Endpoints for submitting, approving, and managing employee time off")
public class LeaveRequestController {

    private final ILeaveRequestService leaveRequestService;

    // ---------------------------------------------------------
    // POST: Create Operations
    // ---------------------------------------------------------

    @PostMapping("/user/{userUuid}")
    @Operation(summary = "Create a leave request", description = "Submits a new request for time off for a specific user. Status defaults to PENDING.")
    public ResponseEntity<LeaveRequestReadOnlyDTO> createLeaveRequest(
            @PathVariable UUID userUuid,
            @Valid @RequestBody LeaveRequestInsertDTO dto) {

        LeaveRequestReadOnlyDTO createdRequest = leaveRequestService.createLeaveRequest(userUuid, dto);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    // ---------------------------------------------------------
    // GET: Read Operations
    // ---------------------------------------------------------

    @GetMapping
    @Operation(summary = "Get all leave requests", description = "Retrieves a paginated list of all active leave requests")
    public ResponseEntity<Page<LeaveRequestReadOnlyDTO>> getAllLeaveRequests(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveRequests(pageable));
    }

    @GetMapping("/{uuid}")
    @Operation(summary = "Get leave request by UUID", description = "Retrieves the details of a specific leave request")
    public ResponseEntity<LeaveRequestReadOnlyDTO> getLeaveRequestByUuid(@PathVariable UUID uuid) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestByUuid(uuid));
    }

    @GetMapping("/user/{userUuid}")
    @Operation(summary = "Get leave requests by user", description = "Retrieves a paginated list of all leave requests submitted by a specific user")
    public ResponseEntity<Page<LeaveRequestReadOnlyDTO>> getLeaveRequestsByUser(
            @PathVariable UUID userUuid,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestsByUser(userUuid, pageable));
    }

    @GetMapping("/status/{statusName}")
    @Operation(summary = "Get leave requests by status", description = "Retrieves a paginated list of leave requests filtered by their current status (e.g., PENDING, APPROVED)")
    public ResponseEntity<Page<LeaveRequestReadOnlyDTO>> getLeaveRequestsByStatus(
            @PathVariable String statusName,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestsByStatus(statusName, pageable));
    }

    @GetMapping("/user/{userUuid}/year/{year}")
    @Operation(summary = "Get approved leaves for year", description = "Retrieves a list of all APPROVED leave requests for a specific user within a given calendar year")
    public ResponseEntity<List<LeaveRequestReadOnlyDTO>> getApprovedLeavesForUserInYear(
            @PathVariable UUID userUuid,
            @PathVariable int year) {
        return ResponseEntity.ok(leaveRequestService.getApprovedLeavesForUserInYear(userUuid, year));
    }

    @GetMapping("/deleted")
    @Operation(summary = "Get deleted leave requests", description = "Retrieves a paginated list of softly deleted (archived) leave requests")
    public ResponseEntity<Page<LeaveRequestReadOnlyDTO>> getDeletedLeaveRequests(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(leaveRequestService.getDeletedLeaveRequests(pageable));
    }

    // ---------------------------------------------------------
    // PUT / PATCH: Update Operations
    // ---------------------------------------------------------

    @PutMapping("/{uuid}/status")
    @Operation(summary = "Update leave request status", description = "Approves or rejects a pending leave request and adjusts the user's balance accordingly")
    public ResponseEntity<LeaveRequestReadOnlyDTO> updateLeaveRequestStatus(
            @PathVariable UUID uuid,
            @Valid @RequestBody LeaveRequestUpdateDTO dto) {

        return ResponseEntity.ok(leaveRequestService.updateLeaveRequestStatus(uuid, dto));
    }

    @PatchMapping("/{uuid}/cancel")
    @Operation(
            summary = "Cancel own leave request",
            description = "Allows the authenticated user to cancel their own pending or approved future leave request"
    )
    public ResponseEntity<LeaveRequestReadOnlyDTO> cancelOwnLeave(
            @PathVariable UUID uuid,
            java.security.Principal principal) {

        return ResponseEntity.ok(
                leaveRequestService.cancelOwnLeave(uuid, principal.getName())
        );
    }
}
