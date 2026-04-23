package com.skillbridge.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "batches")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Batch {

    @Id
    @UuidGenerator
    @Column(updatable = false, nullable = false, length = 36)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @Column(name = "invite_token", unique = true)
    private String inviteToken;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}
