package com.example.leave_management_system.mapper;

import com.example.leave_management_system.dto.user.UserInsertDTO;
import com.example.leave_management_system.dto.user.UserReadOnlyDTO;
import com.example.leave_management_system.model.Role;
import com.example.leave_management_system.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserReadOnlyDTO toReadOnlyDTO(User entity) {
        if (entity == null) {
            return null;
        }

        return new UserReadOnlyDTO(
                entity.getUuid(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getEmail(),
                entity.getRole() != null ? entity.getRole().getName() : null,
                entity.getAvailableLeaveDays(),
                entity.isDeleted()
        );
    }

    public User toEntity(UserInsertDTO dto, Role role) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.setRole(role);

        return user;
    }
}
