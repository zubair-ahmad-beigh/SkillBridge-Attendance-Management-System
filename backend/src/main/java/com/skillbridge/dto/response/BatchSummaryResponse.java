package com.skillbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BatchSummaryResponse {
    private UUID batchId;
    private String batchName;
    private long totalSessions;
    private long totalStudents;
    private long totalAttendanceMarked;
    private long presentCount;
    private long absentCount;
    private long lateCount;
    private double attendanceRate; // percentage
}
