package com.skillbridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "batch_students")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@IdClass(BatchStudent.BatchStudentId.class)
public class BatchStudent {

    @Id
    @Column(name = "batch_id")
    private UUID batchId;

    @Id
    @Column(name = "student_id")
    private UUID studentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", insertable = false, updatable = false)
    private Batch batch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", insertable = false, updatable = false)
    private User student;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchStudentId implements Serializable {
        private UUID batchId;
        private UUID studentId;
    }
}
