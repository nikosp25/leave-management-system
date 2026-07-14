package com.example.leave_management_system.controller;


import com.example.leave_management_system.dto.user.UserInsertDTO;
import com.example.leave_management_system.dto.user.UserReadOnlyDTO;
import com.example.leave_management_system.dto.user.UserUpdateDTO;
import com.example.leave_management_system.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "cookieAuth")
@Tag(name = "User Management", description = "Endpoints for managing employee profiles, roles, and leave balances")
public class UserController {

    private final IUserService userService;

    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    @PostMapping
    @Operation(summary = "Create a new user", description = "Onboards a new employee and sets default leave balance")
    public ResponseEntity<UserReadOnlyDTO> createUser(@Valid @RequestBody UserInsertDTO dto) {
        UserReadOnlyDTO createdUser = userService.createUser(dto);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED); // Returns HTTP 201
    }

    // ---------------------------------------------------------
    // GET: Authenticated User Context
    // ---------------------------------------------------------

    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Returns the profile of the currently authenticated user based on their JWT cookie")
    public ResponseEntity<UserReadOnlyDTO> getCurrentUser(java.security.Principal principal) {

        String userEmail = principal.getName();
        return ResponseEntity.ok(userService.getUserByEmail(userEmail));
    }

    // ---------------------------------------------------------
    // GET: Read Operations (Active Users)
    // ---------------------------------------------------------

    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    @GetMapping
    @Operation(summary = "Get all active users", description = "Retrieves a paginated list of all active employees")
    public ResponseEntity<Page<UserReadOnlyDTO>> getAllUsers(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    @GetMapping("/{uuid}")
    @Operation(summary = "Get user by UUID", description = "Retrieves an active user's profile using their unique ID")
    public ResponseEntity<UserReadOnlyDTO> getUserByUuid(@PathVariable UUID uuid) {
        return ResponseEntity.ok(userService.getUserByUuid(uuid));
    }

    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    @GetMapping("/email/{email}")
    @Operation(summary = "Get user by Email", description = "Retrieves an active user's profile using their email address")
    public ResponseEntity<UserReadOnlyDTO> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }


    @PreAuthorize(
            "hasAuthority('MANAGE_USERS') or " +
                    "(hasAuthority('READ_EMPLOYEES') and #roleName.equalsIgnoreCase('EMPLOYEE'))"
    )
    @GetMapping("/role/{roleName}")
    @Operation(summary = "Get users by role", description = "Retrieves a paginated list of active employees filtered by their role")
    public ResponseEntity<Page<UserReadOnlyDTO>> getUsersByRole(@PathVariable String roleName, @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(userService.getUsersByRole(roleName, pageable));
    }

    // ---------------------------------------------------------
    // GET: Read Operations (Deleted Users)
    // ---------------------------------------------------------

    @PreAuthorize("hasAuthority('READ_DELETED_USERS')")
    @GetMapping("/deleted")
    @Operation(summary = "Get all deleted users", description = "Retrieves a paginated list of offboarded employees")
    public ResponseEntity<Page<UserReadOnlyDTO>> getDeletedUsers(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(userService.getDeletedUsers(pageable));
    }

    @PreAuthorize("hasAuthority('READ_DELETED_USERS')")
    @GetMapping("/deleted/{uuid}")
    @Operation(summary = "Get deleted user by UUID", description = "Retrieves a specific offboarded employee using their ID")
    public ResponseEntity<UserReadOnlyDTO> getDeletedUserByUuid(@PathVariable UUID uuid) {
        return ResponseEntity.ok(userService.getDeletedUserByUuid(uuid));
    }

    @PreAuthorize("hasAuthority('READ_DELETED_USERS')")
    @GetMapping("/deleted/email/{email}")
    @Operation(summary = "Get deleted user by Email", description = "Retrieves a specific offboarded employee using their email")
    public ResponseEntity<UserReadOnlyDTO> getDeletedUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getDeletedUserByEmail(email));
    }

    // ---------------------------------------------------------
    // PUT / PATCH: Update Operations
    // ---------------------------------------------------------

    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    @PutMapping("/{uuid}")
    @Operation(summary = "Update user details", description = "Updates an employee's personal details or role")
    public ResponseEntity<UserReadOnlyDTO> updateUser(
            @PathVariable UUID uuid,
            @Valid @RequestBody UserUpdateDTO dto) {

        return ResponseEntity.ok(userService.updateUser(uuid, dto));
    }

    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    @PatchMapping("/{uuid}/leave-balance")
    @Operation(summary = "Adjust leave balance", description = "Manually adds or subtracts days from an employee's leave balance")
    public ResponseEntity<UserReadOnlyDTO> adjustLeaveBalance(
            @PathVariable UUID uuid,
            @RequestParam int days) {

        return ResponseEntity.ok(userService.adjustLeaveBalance(uuid, days));
    }

    // ---------------------------------------------------------
    // DELETE: Offboarding
    // ---------------------------------------------------------

    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    @DeleteMapping("/{uuid}")
    @Operation(summary = "Delete user", description = "Soft-deletes an employee, locking their account while preserving history")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID uuid) {
        userService.deleteUser(uuid);
        return ResponseEntity.noContent().build(); // Returns HTTP 204
    }
}
