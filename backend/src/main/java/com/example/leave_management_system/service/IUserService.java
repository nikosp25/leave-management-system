package com.example.leave_management_system.service;

import com.example.leave_management_system.dto.user.UserInsertDTO;
import com.example.leave_management_system.dto.user.UserReadOnlyDTO;
import com.example.leave_management_system.dto.user.UserUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.UUID;

public interface IUserService {

    // Write Operations
    UserReadOnlyDTO createUser(UserInsertDTO dto);

    UserReadOnlyDTO updateUser(UUID userUuid, UserUpdateDTO dto);

    /**
     * Adds or subtracts leave days from a user's current balance.
     * The resulting balance cannot be negative.
     */
    UserReadOnlyDTO adjustLeaveBalance(UUID userUuid, int daysToAddOrSubtract);

    /**
     * Soft-deletes a user while keeping their data and leave history.
     */
    void deleteUser(UUID userUuid);

    // Read Operations (Active Users)
    UserReadOnlyDTO getUserByUuid(UUID userUuid);

    UserReadOnlyDTO getUserByEmail(String email);

    Page<UserReadOnlyDTO> getAllUsers(Pageable pageable);

    Page<UserReadOnlyDTO> getUsersByRole(String roleName, Pageable pageable);

    // Read Operations (Deleted Users)
    Page<UserReadOnlyDTO> getDeletedUsers(Pageable pageable);

    UserReadOnlyDTO getDeletedUserByUuid(UUID userUuid);

    UserReadOnlyDTO getDeletedUserByEmail(String email);
}
