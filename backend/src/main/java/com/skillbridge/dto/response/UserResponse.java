package com.skillbridge.dto.response;

import com.skillbridge.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String clerkUserId;
    private String name;
    private String email;
    private Role role;
    private UUID institutionId;
    private Instant createdAt;
}
