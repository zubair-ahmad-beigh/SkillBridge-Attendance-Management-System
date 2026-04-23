package com.skillbridge.controller;

import com.skillbridge.dto.response.BatchSummaryResponse;
import com.skillbridge.dto.response.InstitutionSummaryResponse;
import com.skillbridge.entity.Role;
import com.skillbridge.security.RbacGuard;
import com.skillbridge.service.SummaryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SummaryController {

    private final SummaryService summaryService;
    private final RbacGuard rbac;

    /** GET /api/batches/:id/summary — Batch-level attendance summary */
    @GetMapping("/batches/{id}/summary")
    public ResponseEntity<BatchSummaryResponse> getBatchSummary(
            @PathVariable UUID id,
            HttpServletRequest request) {
        rbac.assertRole(request, Role.INSTITUTION, Role.PROGRAMME_MANAGER, Role.MONITORING_OFFICER, Role.TRAINER);
        return ResponseEntity.ok(summaryService.getBatchSummary(id));
    }

    /** GET /api/institutions/:id/summary — Institution-level summary */
    @GetMapping("/institutions/{id}/summary")
    public ResponseEntity<InstitutionSummaryResponse> getInstitutionSummary(
            @PathVariable UUID id,
            HttpServletRequest request) {
        rbac.assertRole(request, Role.INSTITUTION, Role.PROGRAMME_MANAGER, Role.MONITORING_OFFICER);
        return ResponseEntity.ok(summaryService.getInstitutionSummary(id));
    }

    /** GET /api/programme/summary — Programme-wide summary (all institutions) */
    @GetMapping("/programme/summary")
    public ResponseEntity<List<InstitutionSummaryResponse>> getProgrammeSummary(
            HttpServletRequest request) {
        rbac.assertRole(request, Role.PROGRAMME_MANAGER, Role.MONITORING_OFFICER);
        return ResponseEntity.ok(summaryService.getProgrammeSummary());
    }
}
