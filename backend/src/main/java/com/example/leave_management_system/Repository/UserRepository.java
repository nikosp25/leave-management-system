package com.example.leave_management_system.Repository;

import com.example.leave_management_system.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface UserRepository extends JpaRepository<User, Long> {


    Optional<User> findByEmailAndDeletedFalse(String email);

    @Query("""
        SELECT DISTINCT u
        FROM User u
        JOIN FETCH u.role r
        JOIN FETCH r.capabilities
        WHERE u.email = :email
        AND u.deleted = false
    """)
    Optional<User> findUserForAuthentication(@Param("email") String email); //Fetches the role and capabilities eagerly for the authentication process only

    Optional<User> findByEmail (String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndDeletedFalse (String email);

    Optional<User> findByUuidAndDeletedFalse(UUID uuid);

    Page<User> findByRole_NameAndDeletedFalse(String roleName, Pageable pageable);

    Page<User> findAllByDeletedFalse(Pageable pageable);

    Optional<User> findByUuid(UUID uuid);

    Page<User> findByDeletedTrue(Pageable pageable);

}
