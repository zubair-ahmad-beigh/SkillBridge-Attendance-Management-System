package com.skillbridge.service;

import com.skillbridge.dto.request.AttendanceRequest;
import com.skillbridge.dto.response.AttendanceResponse;
import com.skillbridge.entity.*;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final SessionRepository sessionRepository;
    private final BatchStudentRepository batchStudentRepository;

    @Transactional
    public AttendanceResponse markAttendance(AttendanceRequest req, User student) {
        Session session = sessionRepository.findById(req.getSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session", req.getSessionId()));

        // Verify student is enrolled in this batch
        if (!batchStudentRepository.existsByBatchIdAndStudentId(session.getBatch().getId(), student.getId())) {
            throw new BatchService.RbacNotInBatchException("Student is not enrolled in this batch");
        }

        // Upsert: update if already marked
        Attendance attendance = attendanceRepository
                .findBySessionIdAndStudentId(session.getId(), student.getId())
                .orElseGet(() -> Attendance.builder()
                        .session(session)
                        .student(student)
                        .build());

        attendance.setStatus(req.getStatus());
        attendance.setMarkedAt(Instant.now());
        attendance = attendanceRepository.save(attendance);

        log.info("Attendance marked: student={} session={} status={}", student.getName(), session.getId(), req.getStatus());
        return toResponse(attendance);
    }

    public List<AttendanceResponse> getAttendanceForSession(UUID sessionId) {
        return attendanceRepository.findBySessionId(sessionId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getAttendanceForStudent(UUID studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private AttendanceResponse toResponse(Attendance a) {
        return AttendanceResponse.builder()
                .id(a.getId())
                .sessionId(a.getSession().getId())
                .sessionTitle(a.getSession().getTitle())
                .studentId(a.getStudent().getId())
                .studentName(a.getStudent().getName())
                .status(a.getStatus())
                .markedAt(a.getMarkedAt())
                .build();
    }
}
