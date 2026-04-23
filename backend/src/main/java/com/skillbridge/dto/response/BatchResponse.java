package com.skillbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BatchResponse {
    private UUID id;
    private String name;
    private UUID institutionId;
    private String institutionName;
    private String inviteToken;
    private Instant createdAt;
}
