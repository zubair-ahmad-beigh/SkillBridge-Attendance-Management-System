package com.skillbridge.repository;

import com.skillbridge.entity.Batch;
import com.skillbridge.entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BatchRepository extends JpaRepository<Batch, UUID> {
    List<Batch> findByInstitution(Institution institution);
    Optional<Batch> findByInviteToken(String inviteToken);

    @Query("SELECT b FROM Batch b WHERE b.institution.id = :institutionId")
    List<Batch> findByInstitutionId(@Param("institutionId") UUID institutionId);
}
