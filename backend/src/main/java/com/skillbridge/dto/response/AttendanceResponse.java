package com.skillbridge.dto.response;

import com.skillbridge.entity.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AttendanceResponse {
    private UUID id;
    private UUID sessionId;
    private String sessionTitle;
    private UUID studentId;
    private String studentName;
    private AttendanceStatus status;
    private Instant markedAt;
}
