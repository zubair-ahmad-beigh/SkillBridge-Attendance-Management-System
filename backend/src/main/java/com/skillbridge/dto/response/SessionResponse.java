package com.skillbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SessionResponse {
    private UUID id;
    private UUID batchId;
    private String batchName;
    private UUID trainerId;
    private String trainerName;
    private String title;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Instant createdAt;
}
