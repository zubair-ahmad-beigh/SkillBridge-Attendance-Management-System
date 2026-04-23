package com.skillbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InstitutionSummaryResponse {
    private UUID institutionId;
    private String institutionName;
    private long totalBatches;
    private long totalTrainers;
    private long totalStudents;
    private List<BatchSummaryResponse> batches;
}
