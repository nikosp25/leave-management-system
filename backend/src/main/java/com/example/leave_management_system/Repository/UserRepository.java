package com.example.leave_management_system.Repository;

import com.example.leave_management_system.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface UserRepository extends JpaRepository<User, Long> {


    Optional<User> findByEmailAndDeletedFalse(String email);

    Optional<User> findByEmail (String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndDeletedFalse (String email);

    Optional<User> findByUuidAndDeletedFalse(UUID uuid);

    Page<User> findByRole_NameAndDeletedFalse(String roleName, Pageable pageable);

    Page<User> findAllByDeletedFalse(Pageable pageable);

    Optional<User> findByUuid(UUID uuid);

    Page<User> findByDeletedTrue(Pageable pageable);

}
