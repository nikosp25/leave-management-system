package com.example.leave_management_system.Repository;

import com.example.leave_management_system.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeaveStatusRepository extends JpaRepository<LeaveStatus, Long> {
    Optional<LeaveStatus> findByName(String name);
}
