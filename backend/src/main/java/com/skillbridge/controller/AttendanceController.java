package com.skillbridge.controller;

import com.skillbridge.dto.request.AttendanceRequest;
import com.skillbridge.dto.response.AttendanceResponse;
import com.skillbridge.entity.Role;
import com.skillbridge.entity.User;
import com.skillbridge.security.RbacGuard;
import com.skillbridge.service.AttendanceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final RbacGuard rbac;

    /** POST /api/attendance/mark — Student marks their own attendance */
    @PostMapping("/mark")
    public ResponseEntity<AttendanceResponse> markAttendance(
            @Valid @RequestBody AttendanceRequest req,
            HttpServletRequest request) {
        User caller = rbac.assertRole(request, Role.STUDENT);
        return ResponseEntity.ok(attendanceService.markAttendance(req, caller));
    }

    /** GET /api/attendance/session/:sessionId — Attendance for a given session */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<AttendanceResponse>> getBySession(
            @PathVariable UUID sessionId,
            HttpServletRequest request) {
        rbac.assertRole(request, Role.TRAINER, Role.INSTITUTION,
                Role.PROGRAMME_MANAGER, Role.MONITORING_OFFICER);
        return ResponseEntity.ok(attendanceService.getAttendanceForSession(sessionId));
    }

    /** GET /api/attendance/me — Student views their own attendance history */
    @GetMapping("/me")
    public ResponseEntity<List<AttendanceResponse>> getMyAttendance(HttpServletRequest request) {
        User caller = rbac.assertRole(request, Role.STUDENT);
        return ResponseEntity.ok(attendanceService.getAttendanceForStudent(caller.getId()));
    }
}
