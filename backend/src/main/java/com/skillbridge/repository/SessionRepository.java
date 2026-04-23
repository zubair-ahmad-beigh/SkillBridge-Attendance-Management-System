package com.skillbridge.repository;

import com.skillbridge.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {
    List<Session> findByBatchId(UUID batchId);
    List<Session> findByTrainerId(UUID trainerId);

    @Query("SELECT s FROM Session s WHERE s.batch.institution.id = :institutionId")
    List<Session> findByInstitutionId(@Param("institutionId") UUID institutionId);
}
