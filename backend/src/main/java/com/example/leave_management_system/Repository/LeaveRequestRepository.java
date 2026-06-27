package com.example.leave_management_system.Repository;


import com.example.leave_management_system.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {


    Optional<LeaveRequest> findByUuidAndDeletedFalse(UUID uuid);

    List<LeaveRequest> findByUser_UuidAndDeletedFalseOrderByStartDateDesc(UUID userUuid);

    List<LeaveRequest> findByLeaveStatus_NameAndDeletedFalseOrderByStartDateAsc(String statusName);

    List<LeaveRequest> findAllByDeletedFalse();

    // Checks for overlapping date bookings
    @Query("""
        SELECT COUNT(l) > 0
        FROM LeaveRequest l
        WHERE l.user.uuid = :userUuid 
          AND l.leaveStatus.name <> :statusName 
          AND l.startDate <= :endDate
          AND l.endDate >= :startDate
          AND l.deleted = false
    """)
    boolean existsOverlappingLeave(
            @Param("userUuid") UUID userUuid,
            @Param("statusName") String statusName,
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
