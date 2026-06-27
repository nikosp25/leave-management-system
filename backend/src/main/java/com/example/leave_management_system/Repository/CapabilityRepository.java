package com.example.leave_management_system.Repository;

import com.example.leave_management_system.model.Capability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CapabilityRepository extends JpaRepository<Capability, Long> {
    Optional<Capability> findByName(String name);
}