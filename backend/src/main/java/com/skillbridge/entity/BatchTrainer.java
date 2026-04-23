package com.skillbridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "batch_trainers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@IdClass(BatchTrainer.BatchTrainerId.class)
public class BatchTrainer {

    @Id
    @Column(name = "batch_id")
    private UUID batchId;

    @Id
    @Column(name = "trainer_id")
    private UUID trainerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", insertable = false, updatable = false)
    private Batch batch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", insertable = false, updatable = false)
    private User trainer;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchTrainerId implements Serializable {
        private UUID batchId;
        private UUID trainerId;
    }
}
