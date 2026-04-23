package com.skillbridge.repository;

import com.skillbridge.entity.BatchTrainer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BatchTrainerRepository extends JpaRepository<BatchTrainer, BatchTrainer.BatchTrainerId> {
    List<BatchTrainer> findByTrainerId(UUID trainerId);
    List<BatchTrainer> findByBatchId(UUID batchId);
    boolean existsByBatchIdAndTrainerId(UUID batchId, UUID trainerId);
}
