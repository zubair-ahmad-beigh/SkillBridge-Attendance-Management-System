package com.skillbridge.repository;

import com.skillbridge.entity.BatchStudent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BatchStudentRepository extends JpaRepository<BatchStudent, BatchStudent.BatchStudentId> {
    List<BatchStudent> findByStudentId(UUID studentId);
    List<BatchStudent> findByBatchId(UUID batchId);
    boolean existsByBatchIdAndStudentId(UUID batchId, UUID studentId);
}
