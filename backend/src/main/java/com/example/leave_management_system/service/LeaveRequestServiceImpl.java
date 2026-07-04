package com.example.leave_management_system.service;


import com.example.leave_management_system.Repository.LeaveRequestRepository;
import com.example.leave_management_system.Repository.LeaveStatusRepository;
import com.example.leave_management_system.Repository.LeaveTypeRepository;
import com.example.leave_management_system.Repository.UserRepository;
import com.example.leave_management_system.dto.leaveRequest.LeaveRequestInsertDTO;
import com.example.leave_management_system.dto.leaveRequest.LeaveRequestReadOnlyDTO;
import com.example.leave_management_system.dto.leaveRequest.LeaveRequestUpdateDTO;
import com.example.leave_management_system.exceptions.*;
import com.example.leave_management_system.mapper.LeaveRequestMapper;
import com.example.leave_management_system.model.LeaveRequest;
import com.example.leave_management_system.model.LeaveStatus;
import com.example.leave_management_system.model.LeaveType;
import com.example.leave_management_system.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeaveRequestServiceImpl implements ILeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveStatusRepository leaveStatusRepository;
    private final LeaveRequestMapper leaveRequestMapper;

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_REJECTED = "REJECTED";

    @Override
    @Transactional
    public LeaveRequestReadOnlyDTO createLeaveRequest(UUID userUuid, LeaveRequestInsertDTO dto) {
        if (dto.startDate().isAfter(dto.endDate())) {
            throw new InvalidDateRangeException("Start date cannot be after end date.");
        }

        User user = userRepository.findByUuidAndDeletedFalse(userUuid)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Check overlapping leaves (ignoring REJECTED statuses)
        boolean isOverlapping = leaveRequestRepository.existsOverlappingLeave(
                userUuid, STATUS_REJECTED, dto.startDate(), dto.endDate());
        if (isOverlapping) {
            throw new OverlappingLeaveException("You already have a leave request during this period.");
        }

        // Prevent submission if they don't have enough balance (even before approval)
        int requestedDays = calculateWorkingDays(dto.startDate(), dto.endDate());
        if (user.getAvailableLeaveDays() < requestedDays) {
            throw new InsufficientLeaveBalanceException("Insufficient leave balance. You requested " + requestedDays +
                    " working days, but only have " + user.getAvailableLeaveDays() + " available.");
        }

        LeaveType leaveType = leaveTypeRepository.findByName(dto.leaveTypeName())
                .orElseThrow(() -> new LeaveTypeNotFoundException("Leave type not found"));

        LeaveStatus pendingStatus = leaveStatusRepository.findByName(STATUS_PENDING)
                .orElseThrow(() -> new LeaveStatusNotFoundException("Pending status not found in database"));

        LeaveRequest leaveRequest = leaveRequestMapper.toEntity(dto, user, leaveType, pendingStatus);

        // We do NOT deduct balance here. Balance is deducted upon approval.
        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);

        return leaveRequestMapper.toReadOnlyDTO(savedRequest);
    }

    @Override
    @Transactional
    public LeaveRequestReadOnlyDTO updateLeaveRequestStatus(UUID leaveUuid, LeaveRequestUpdateDTO dto) {
        LeaveRequest leaveRequest = leaveRequestRepository.findByUuidAndDeletedFalse(leaveUuid)
                .orElseThrow(() -> new LeaveRequestNotFoundException("Leave request not found"));

        LeaveStatus newStatus = leaveStatusRepository.findByName(dto.leaveStatusName())
                .orElseThrow(() -> new LeaveStatusNotFoundException("Status not found"));

        String oldStatusName = leaveRequest.getLeaveStatus().getName();
        String newStatusName = newStatus.getName();

        // Calculate actual working days for this request
        int workingDays = calculateWorkingDays(leaveRequest.getStartDate(), leaveRequest.getEndDate());
        User user = leaveRequest.getUser();


        // Handle balance deductions and restorations based on status transitions
        if (!STATUS_APPROVED.equals(oldStatusName) && STATUS_APPROVED.equals(newStatusName)) {
            // Approving a request: Deduct days
            if (user.getAvailableLeaveDays() < workingDays) {
                throw new InsufficientLeaveBalanceException("User does not have enough leave balance to approve this request.");
            }
            user.setAvailableLeaveDays(user.getAvailableLeaveDays() - workingDays);

        } else if (STATUS_APPROVED.equals(oldStatusName) && STATUS_REJECTED.equals(newStatusName)) {
            // Rejecting an already APPROVED request: Restore days
            user.setAvailableLeaveDays(user.getAvailableLeaveDays() + workingDays);
        }

        leaveRequest.setLeaveStatus(newStatus);
        leaveRequest.setManagerComment(dto.comment());

        LeaveRequest updatedRequest = leaveRequestRepository.save(leaveRequest);
        userRepository.save(user); // Save the updated user balance

        return leaveRequestMapper.toReadOnlyDTO(updatedRequest);
    }

    @Override
    public LeaveRequestReadOnlyDTO getLeaveRequestByUuid(UUID leaveUuid) {
        LeaveRequest leaveRequest = leaveRequestRepository.findByUuidAndDeletedFalse(leaveUuid)
                .orElseThrow(() -> new LeaveRequestNotFoundException("Leave request not found"));
        return leaveRequestMapper.toReadOnlyDTO(leaveRequest);
    }

    @Override
    public Page<LeaveRequestReadOnlyDTO> getLeaveRequestsByUser(UUID userUuid, Pageable pageable) {
        return leaveRequestRepository.findByUser_UuidAndDeletedFalse(userUuid, pageable)
                .map(leaveRequestMapper::toReadOnlyDTO);
    }

    @Override
    public Page<LeaveRequestReadOnlyDTO> getAllLeaveRequests(Pageable pageable) {
        return leaveRequestRepository.findAllByDeletedFalse(pageable)
                .map(leaveRequestMapper::toReadOnlyDTO);
    }

    @Override
    public Page<LeaveRequestReadOnlyDTO> getDeletedLeaveRequests(Pageable pageable) {
        return leaveRequestRepository.findByDeletedTrue(pageable)
                .map(leaveRequestMapper::toReadOnlyDTO);
    }

    @Override
    public Page<LeaveRequestReadOnlyDTO> getLeaveRequestsByStatus(String statusName, Pageable pageable) {
        return leaveRequestRepository.findByLeaveStatus_NameAndDeletedFalse(statusName, pageable)
                .map(leaveRequestMapper::toReadOnlyDTO);
    }

    @Override
    public List<LeaveRequestReadOnlyDTO> getApprovedLeavesForUserInYear(UUID userUuid, int year) {
        return leaveRequestRepository.findApprovedRequestsForUserInYear(userUuid, year)
                .stream()
                .map(leaveRequestMapper::toReadOnlyDTO)
                .toList(); // or Collectors.toList() if on older Java version
    }

    /**
     * Calculates the number of working days between two dates (inclusive), skipping weekends.
     */
    private int calculateWorkingDays(LocalDate startDate, LocalDate endDate) {
        int workingDays = 0;
        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
            if (dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY) {
                workingDays++;
            }
            currentDate = currentDate.plusDays(1);
        }

        return workingDays;
    }
}


