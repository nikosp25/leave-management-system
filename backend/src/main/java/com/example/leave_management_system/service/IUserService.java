package com.example.leave_management_system.service;

import com.example.leave_management_system.dto.user.UserInsertDTO;
import com.example.leave_management_system.dto.user.UserReadOnlyDTO;
import com.example.leave_management_system.dto.user.UserUpdateDTO;
import com.example.leave_management_system.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IUserService {

    // Write Operations
    UserReadOnlyDTO createUser(UserInsertDTO dto);
    UserReadOnlyDTO updateUser(UUID userUuid, UserUpdateDTO dto);
    UserReadOnlyDTO adjustLeaveBalance(UUID userUuid, int daysToAddOrSubtract);
    void deleteUser(UUID userUuid);

    // Read Operations (Active Users)
    UserReadOnlyDTO getUserByUuid(UUID userUuid);
//    User getUserByEmailForSecurity(String email); // Returns the Entity for Spring Security
    Page<UserReadOnlyDTO> getAllUsers(Pageable pageable);
    Page<UserReadOnlyDTO> getUsersByRole(String roleName, Pageable pageable);

    // Read Operations (Deleted Users)
    Page<UserReadOnlyDTO> getDeletedUsers(Pageable pageable);
    UserReadOnlyDTO getDeletedUserByUuid(UUID userUuid);
}
