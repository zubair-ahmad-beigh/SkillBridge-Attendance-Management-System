package com.skillbridge.service;

import com.skillbridge.dto.request.SessionRequest;
import com.skillbridge.dto.response.SessionResponse;
import com.skillbridge.entity.*;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionService {

    private final SessionRepository sessionRepository;
    private final BatchRepository batchRepository;
    private final BatchTrainerRepository batchTrainerRepository;
    private final BatchStudentRepository batchStudentRepository;

    @Transactional
    public SessionResponse createSession(SessionRequest req, User trainer) {
        Batch batch = batchRepository.findById(req.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch", req.getBatchId()));

        if (!batchTrainerRepository.existsByBatchIdAndTrainerId(batch.getId(), trainer.getId())) {
            throw new BatchService.RbacNotInBatchException("Trainer is not assigned to this batch");
        }

        Session session = Session.builder()
                .batch(batch)
                .trainer(trainer)
                .title(req.getTitle())
                .date(req.getDate())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .build();

        session = sessionRepository.save(session);
        log.info("Session '{}' created for batch {} by trainer {}", session.getTitle(), batch.getId(), trainer.getName());
        return toResponse(session);
    }

    public List<SessionResponse> getSessionsForBatch(UUID batchId) {
        return sessionRepository.findByBatchId(batchId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<SessionResponse> getSessionsForTrainer(UUID trainerId) {
        return sessionRepository.findByTrainerId(trainerId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<SessionResponse> getSessionsForStudent(UUID studentId) {
        // Get all batches this student belongs to, then all sessions in those batches
        List<UUID> batchIds = batchStudentRepository.findByStudentId(studentId).stream()
                .map(BatchStudent::getBatchId)
                .collect(Collectors.toList());

        return batchIds.stream()
                .flatMap(bid -> sessionRepository.findByBatchId(bid).stream())
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<SessionResponse> getAllSessions() {
        return sessionRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SessionResponse getSession(UUID sessionId) {
        return toResponse(sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session", sessionId)));
    }

    private SessionResponse toResponse(Session s) {
        return SessionResponse.builder()
                .id(s.getId())
                .batchId(s.getBatch().getId())
                .batchName(s.getBatch().getName())
                .trainerId(s.getTrainer().getId())
                .trainerName(s.getTrainer().getName())
                .title(s.getTitle())
                .date(s.getDate())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
