package com.skillbridge.controller;

import com.skillbridge.dto.request.SessionRequest;
import com.skillbridge.dto.response.SessionResponse;
import com.skillbridge.entity.Role;
import com.skillbridge.entity.User;
import com.skillbridge.security.RbacGuard;
import com.skillbridge.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;
    private final RbacGuard rbac;

    /** POST /api/sessions — Trainer creates a session */
    @PostMapping
    public ResponseEntity<SessionResponse> createSession(
            @Valid @RequestBody SessionRequest req,
            HttpServletRequest request) {
        User caller = rbac.assertRole(request, Role.TRAINER);
        return ResponseEntity.ok(sessionService.createSession(req, caller));
    }

    /** GET /api/sessions — Role-scoped session list */
    @GetMapping
    public ResponseEntity<List<SessionResponse>> listSessions(HttpServletRequest request) {
        User caller = rbac.currentUser(request);
        return switch (caller.getRole()) {
            case TRAINER -> ResponseEntity.ok(sessionService.getSessionsForTrainer(caller.getId()));
            case STUDENT -> ResponseEntity.ok(sessionService.getSessionsForStudent(caller.getId()));
            case INSTITUTION, PROGRAMME_MANAGER, MONITORING_OFFICER ->
                    ResponseEntity.ok(sessionService.getAllSessions());
        };
    }

    /** GET /api/sessions/:id — Single session detail */
    @GetMapping("/{id}")
    public ResponseEntity<SessionResponse> getSession(
            @PathVariable UUID id,
            HttpServletRequest request) {
        rbac.currentUser(request); // must be authenticated
        return ResponseEntity.ok(sessionService.getSession(id));
    }

    /** GET /api/sessions/:id/attendance — Trainer views attendance for a session */
    @GetMapping("/{id}/attendance")
    public ResponseEntity<?> getSessionAttendance(
            @PathVariable UUID id,
            HttpServletRequest request) {
        rbac.assertRole(request, Role.TRAINER, Role.INSTITUTION,
                Role.PROGRAMME_MANAGER, Role.MONITORING_OFFICER);
        return ResponseEntity.ok(sessionService.getSession(id));
    }
}
