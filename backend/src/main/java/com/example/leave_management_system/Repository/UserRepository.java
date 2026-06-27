package com.example.leave_management_system.Repository;

import com.example.leave_management_system.model.User;
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

    List<User> findByRole_NameAndDeletedFalse(String roleName);

    List<User> findAllByDeletedFalse();

    Optional<User> findByUuid(UUID uuid);

}
