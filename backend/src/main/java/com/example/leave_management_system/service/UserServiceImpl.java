package com.example.leave_management_system.service;

import com.example.leave_management_system.Repository.RoleRepository;
import com.example.leave_management_system.Repository.UserRepository;
import com.example.leave_management_system.dto.user.UserInsertDTO;
import com.example.leave_management_system.dto.user.UserReadOnlyDTO;
import com.example.leave_management_system.dto.user.UserUpdateDTO;
import com.example.leave_management_system.exceptions.EmailAlreadyExistsException;
import com.example.leave_management_system.exceptions.InsufficientLeaveBalanceException;
import com.example.leave_management_system.exceptions.RoleNotFoundException;
import com.example.leave_management_system.exceptions.UserNotFoundException;
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

    private final PasswordEncoder passwordEncoder;

    private static final int DEFAULT_LEAVE_DAYS = 25;


    @Override
    @Transactional
    public UserReadOnlyDTO createUser(UserInsertDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new EmailAlreadyExistsException("Email is already in use");
        }

        Role role = roleRepository.findByName(dto.roleName())
                .orElseThrow(() -> new RoleNotFoundException("Role not found"));

        User user = userMapper.toEntity(dto, role);

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(dto.password()));

        // Give new users the default leave balance
        user.setAvailableLeaveDays(DEFAULT_LEAVE_DAYS);

        User savedUser = userRepository.save(user);
        return userMapper.toReadOnlyDTO(savedUser);
    }


    @Override
    @Transactional
    public UserReadOnlyDTO updateUser(UUID userUuid, UserUpdateDTO dto) {
        User user = userRepository.findByUuidAndDeletedFalse(userUuid)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Check if email is being changed to one that already exists
        if (!user.getEmail().equals(dto.email()) && userRepository.existsByEmail(dto.email())) {
            throw new EmailAlreadyExistsException("New email is already in use by another account");
        }

        Role role = roleRepository.findByName(dto.roleName())
                .orElseThrow(() -> new RoleNotFoundException("Role not found"));

        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setEmail(dto.email());
        user.setRole(role);

        return userMapper.toReadOnlyDTO(userRepository.save(user));
    }


    @Override
    @Transactional
    public UserReadOnlyDTO adjustLeaveBalance(UUID userUuid, int daysToAddOrSubtract) {
        User user = userRepository.findByUuidAndDeletedFalse(userUuid)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        int newBalance = user.getAvailableLeaveDays() + daysToAddOrSubtract;

        // Prevent the balance from dropping below zero
        if (newBalance < 0) {
            throw new InsufficientLeaveBalanceException(
                    "Cannot deduct " + Math.abs(daysToAddOrSubtract) +
                            " days. User only has " + user.getAvailableLeaveDays() + " days available."
            );
        }

        user.setAvailableLeaveDays(newBalance);
        return userMapper.toReadOnlyDTO(userRepository.save(user));
    }


    @Override
    @Transactional
    public void deleteUser(UUID userUuid) {
        User user = userRepository.findByUuidAndDeletedFalse(userUuid)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.softDelete();
        userRepository.save(user);
    }


    @Override
    public Page<UserReadOnlyDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAllByDeletedFalse(pageable)
                .map(userMapper::toReadOnlyDTO);
    }


    @Override
    public Page<UserReadOnlyDTO> getUsersByRole(String roleName, Pageable pageable) {
        return userRepository.findByRole_NameAndDeletedFalse(roleName, pageable)
                .map(userMapper::toReadOnlyDTO);
    }


    @Override
    public Page<UserReadOnlyDTO> getDeletedUsers(Pageable pageable) {
        return userRepository.findByDeletedTrue(pageable)
                .map(userMapper::toReadOnlyDTO);
    }


    @Override
    public UserReadOnlyDTO getDeletedUserByUuid(UUID userUuid) {
        // Fetch ignoring the deleted=false filter
        User user = userRepository.findByUuid(userUuid)
                .filter(User::isDeleted) // Ensure they are actually deleted
                .orElseThrow(() -> new UserNotFoundException("Deleted user not found"));
        return userMapper.toReadOnlyDTO(user);
    }


    @Override
    public UserReadOnlyDTO getUserByUuid(UUID userUuid) {
        User user = userRepository.findByUuidAndDeletedFalse(userUuid)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return userMapper.toReadOnlyDTO(user);
    }


    @Override
    public UserReadOnlyDTO getUserByEmail(String email) {
        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        return userMapper.toReadOnlyDTO(user);
    }


    @Override
    public UserReadOnlyDTO getDeletedUserByEmail(String email) {
        // Fetch ignoring the deleted=false filter
        User user = userRepository.findByEmail(email)
                .filter(User::isDeleted) // Ensure they are actually deleted
                .orElseThrow(() -> new UserNotFoundException("Deleted user not found with email: " + email));
        return userMapper.toReadOnlyDTO(user);
    }


}

