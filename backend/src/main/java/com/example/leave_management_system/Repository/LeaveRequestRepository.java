package com.example.leave_management_system.Repository;


import com.example.leave_management_system.model.LeaveRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {


    Optional<LeaveRequest> findByUuidAndDeletedFalse(UUID uuid);

    Page<LeaveRequest> findByUser_UuidAndDeletedFalse(UUID userUuid, Pageable pageable);

    Page<LeaveRequest> findByLeaveStatus_NameAndDeletedFalse(String statusName, Pageable pageable);

    Page<LeaveRequest> findAllByDeletedFalse(Pageable pageable);

    Page<LeaveRequest> findByDeletedTrue(Pageable pageable);


    // Checks for overlapping date bookings
    @Query("""
        SELECT COUNT(l) > 0
        FROM LeaveRequest l
        WHERE l.user.uuid = :userUuid
          AND l.leaveStatus.name NOT IN (:ignoredStatuses)
          AND l.startDate <= :endDate
          AND l.endDate >= :startDate
          AND l.deleted = false
   """)
    boolean existsOverlappingLeave(
            @Param("userUuid") UUID userUuid,
            @Param("ignoredStatuses") List<String> ignoredStatuses,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Grabs all the approved leave days of the user this year
    @Query("""
        SELECT l 
        FROM LeaveRequest l
        WHERE l.user.uuid = :userUuid 
          AND l.leaveStatus.name = 'APPROVED'
          AND l.deleted = false
          AND EXTRACT(YEAR FROM l.startDate) = :currentYear
    """)
    List<LeaveRequest> findApprovedRequestsForUserInYear(
            @Param("userUuid") UUID userUuid,
            @Param("currentYear") int currentYear
    );


}
