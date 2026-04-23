package com.skillbridge.repository;

import com.skillbridge.entity.Attendance;
import com.skillbridge.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    List<Attendance> findBySessionId(UUID sessionId);
    List<Attendance> findByStudentId(UUID studentId);
    Optional<Attendance> findBySessionIdAndStudentId(UUID sessionId, UUID studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.session.batch.id = :batchId AND a.status = :status")
    long countByBatchIdAndStatus(@Param("batchId") UUID batchId, @Param("status") AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.session.batch.id = :batchId")
    long countByBatchId(@Param("batchId") UUID batchId);
}
