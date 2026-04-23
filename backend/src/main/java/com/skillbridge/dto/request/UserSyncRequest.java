package com.skillbridge.dto.request;

import com.skillbridge.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserSyncRequest {
    @NotBlank
    private String clerkUserId;
    @NotBlank
    private String name;
    @NotBlank @Email
    private String email;
    @NotNull
    private Role role;
    private String institutionId; // optional – UUID string
}
