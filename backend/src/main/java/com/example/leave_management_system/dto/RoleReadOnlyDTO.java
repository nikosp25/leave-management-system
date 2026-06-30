package com.example.leave_management_system.dto;

import java.util.Set;

public record RoleReadOnlyDTO(
        Long id,
        String name,
        Set<String> capabilityNames
) {
}
