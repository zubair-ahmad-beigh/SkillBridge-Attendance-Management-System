package com.skillbridge.controller;

import com.skillbridge.dto.request.BatchRequest;
import com.skillbridge.dto.response.BatchResponse;
import com.skillbridge.entity.Role;
import com.skillbridge.entity.User;
import com.skillbridge.security.RbacGuard;
import com.skillbridge.service.BatchService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;
    private final RbacGuard rbac;

    /** POST /api/batches — Trainer or Institution creates a batch */
    @PostMapping
    public ResponseEntity<BatchResponse> createBatch(
            @Valid @RequestBody BatchRequest req,
            HttpServletRequest request) {
        User caller = rbac.assertRole(request, Role.TRAINER, Role.INSTITUTION);
        return ResponseEntity.ok(batchService.createBatch(req, caller));
    }

    /** POST /api/batches/:id/invite — Trainer generates an invite token */
    @PostMapping("/{id}/invite")
    public ResponseEntity<BatchResponse> generateInvite(
            @PathVariable UUID id,
            HttpServletRequest request) {
        User caller = rbac.assertRole(request, Role.TRAINER);
        return ResponseEntity.ok(batchService.generateInviteLink(id, caller));
    }

    /** POST /api/batches/:id/join — Student joins via invite token */
    @PostMapping("/{id}/join")
    public ResponseEntity<BatchResponse> joinBatch(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        User caller = rbac.assertRole(request, Role.STUDENT);
        String token = body.get("inviteToken");
        return ResponseEntity.ok(batchService.joinBatch(id, token, caller));
    }

    /** GET /api/batches — List batches based on caller's role */
    @GetMapping
    public ResponseEntity<List<BatchResponse>> listBatches(HttpServletRequest request) {
        User caller = rbac.currentUser(request);
        return switch (caller.getRole()) {
            case TRAINER -> ResponseEntity.ok(batchService.getBatchesForTrainer(caller.getId()));
            case STUDENT -> ResponseEntity.ok(batchService.getBatchesForStudent(caller.getId()));
            case INSTITUTION -> ResponseEntity.ok(
                    batchService.getBatchesForInstitution(caller.getInstitution().getId()));
            case PROGRAMME_MANAGER, MONITORING_OFFICER -> ResponseEntity.ok(batchService.getAllBatches());
        };
    }
}
