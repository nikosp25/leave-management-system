package com.example.leave_management_system.dto.user;

import java.util.Set;
import java.util.UUID;

public record UserReadOnlyDTO(
        UUID uuid,
        String firstName,
        String lastName,
        String email,
        String roleName,
        Set<String> capabilities,
        Integer availableLeaveDays,
        boolean deleted
) {
}
