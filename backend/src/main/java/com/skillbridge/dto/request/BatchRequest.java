package com.skillbridge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class BatchRequest {
    @NotBlank(message = "Batch name is required")
    private String name;
    @NotNull(message = "Institution ID is required")
    private UUID institutionId;
}
