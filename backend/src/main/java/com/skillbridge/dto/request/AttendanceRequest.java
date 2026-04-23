package com.skillbridge.dto.request;

import com.skillbridge.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AttendanceRequest {
    @NotNull(message = "Session ID is required")
    private UUID sessionId;
    @NotNull(message = "Status is required")
    private AttendanceStatus status;
}
