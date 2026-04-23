package com.skillbridge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class SessionRequest {
    @NotNull(message = "Batch ID is required")
    private UUID batchId;
    @NotBlank(message = "Session title is required")
    private String title;
    @NotNull(message = "Date is required")
    private LocalDate date;
    @NotNull(message = "Start time is required")
    private LocalTime startTime;
    @NotNull(message = "End time is required")
    private LocalTime endTime;
}
