package com.example.leave_management_system.service;

import com.example.leave_management_system.Repository.RoleRepository;
import com.example.leave_management_system.Repository.UserRepository;
import com.example.leave_management_system.dto.user.UserInsertDTO;
import com.example.leave_management_system.dto.user.UserReadOnlyDTO;
import com.example.leave_management_system.dto.user.UserUpdateDTO;
import com.example.leave_management_system.mapper.UserMapper;
import com.example.leave_management_system.model.Role;
import com.example.leave_management_system.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    // Spring Security's password encoder
    private final PasswordEncoder passwordEncoder;

    private static final int DEFAULT_LEAVE_DAYS = 25;


    /*
     * Intended Roles: ADMIN
     * Purpose: Onboarding a new employee into the system.
     */
    @Override
    @Transactional
    public UserReadOnlyDTO createUser(UserInsertDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        Role role = roleRepository.findByName(dto.roleName())
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));

        User user = userMapper.toEntity(dto, role);

        // 1. Hash the password securely
        user.setPassword(passwordEncoder.encode(dto.password()));

        // 2. Set the default 25-day balance
        user.setAvailableLeaveDays(DEFAULT_LEAVE_DAYS);

        User savedUser = userRepository.save(user);
        return userMapper.toReadOnlyDTO(savedUser);
    }


    /*
     * Intended Roles: ADMIN
     * Purpose: Updating an employee's details or promoting their role.
     */
    @Override
    @Transactional
    public UserReadOnlyDTO updateUser(UUID userUuid, UserUpdateDTO dto) {
        User user = userRepository.findByUuidAndDeletedFalse(userUuid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if email is being changed to one that already exists
        if (!user.getEmail().equals(dto.email()) && userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("New email is already in use by another account");
        }

        Role role = roleRepository.findByName(dto.roleName())
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));

        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setEmail(dto.email());
        user.setRole(role);

        return userMapper.toReadOnlyDTO(userRepository.save(user));
    }

    /*
     * Intended Roles: ADMIN
     * Purpose: Manually correcting leave days (e.g., granting bonus days or docking days).
     */
    @Override
    @Transactional
    public UserReadOnlyDTO adjustLeaveBalance(UUID userUuid, int daysToAddOrSubtract) {
        User user = userRepository.findByUuidAndDeletedFalse(userUuid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setAvailableLeaveDays(user.getAvailableLeaveDays() + daysToAddOrSubtract);
        return userMapper.toReadOnlyDTO(userRepository.save(user));
    }

    /*
     * Intended Roles: ADMIN
     * Purpose: Offboarding an employee (revoking access while keeping history).
     */
    @Override
    @Transactional
    public void deleteUser(UUID userUuid) {
        User user = userRepository.findByUuidAndDeletedFalse(userUuid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.softDelete();
        userRepository.save(user);
    }

    /*
     * Intended Roles: ADMIN / MANAGER
     * Purpose: Viewing the company directory of all active employees.
     */
    @Override
    public Page<UserReadOnlyDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAllByDeletedFalse(pageable)
                .map(userMapper::toReadOnlyDTO);
    }

    /*
     * Intended Roles: ADMIN / MANAGER
     * Purpose: Filtering the company directory (e.g., "Show me all Managers").
     */
    @Override
    public Page<UserReadOnlyDTO> getUsersByRole(String roleName, Pageable pageable) {
        return userRepository.findByRole_NameAndDeletedFalse(roleName, pageable)
                .map(userMapper::toReadOnlyDTO);
    }

    /*
     * Intended Roles: ADMIN
     * Purpose: Auditing former employees who have left the company.
     */
    @Override
    public Page<UserReadOnlyDTO> getDeletedUsers(Pageable pageable) {
        return userRepository.findByDeletedTrue(pageable)
                .map(userMapper::toReadOnlyDTO);
    }

    /*
     * Intended Roles: ADMIN
     * Purpose: Viewing the specific profile of a former employee.
     */
    @Override
    public UserReadOnlyDTO getDeletedUserByUuid(UUID userUuid) {
        // Fetch ignoring the deleted=false filter
        User user = userRepository.findByUuid(userUuid)
                .filter(User::isDeleted) // Ensure they are actually deleted
                .orElseThrow(() -> new IllegalArgumentException("Deleted user not found"));
        return userMapper.toReadOnlyDTO(user);
    }


    /*
     * Intended Roles: ALL ROLES (Admin, Manager, Employee)
     * Purpose: Viewing a specific user's public profile. Employees use this to see their own data.
     */
    @Override
    public UserReadOnlyDTO getUserByUuid(UUID userUuid) {
        User user = userRepository.findByUuidAndDeletedFalse(userUuid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return userMapper.toReadOnlyDTO(user);
    }
}

