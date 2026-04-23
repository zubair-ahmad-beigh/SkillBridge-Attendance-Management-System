package com.skillbridge.service;

import com.skillbridge.dto.request.BatchRequest;
import com.skillbridge.dto.response.BatchResponse;
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
public class BatchService {

    private final BatchRepository batchRepository;
    private final InstitutionRepository institutionRepository;
    private final BatchTrainerRepository batchTrainerRepository;
    private final BatchStudentRepository batchStudentRepository;

    @Transactional
    public BatchResponse createBatch(BatchRequest req, User creator) {
        Institution institution = institutionRepository.findById(req.getInstitutionId())
                .orElseThrow(() -> new ResourceNotFoundException("Institution", req.getInstitutionId()));

        Batch batch = Batch.builder()
                .name(req.getName())
                .institution(institution)
                .build();
        batch = batchRepository.save(batch);

        // Auto-link the creating trainer to this batch
        if (creator.getRole() == Role.TRAINER) {
            BatchTrainer bt = new BatchTrainer(batch.getId(), creator.getId(), null, null);
            batchTrainerRepository.save(bt);
        }

        log.info("Batch '{}' created by {}", batch.getName(), creator.getName());
        return toResponse(batch);
    }

    @Transactional
    public BatchResponse generateInviteLink(UUID batchId, User trainer) {
        Batch batch = getBatchOrThrow(batchId);
        assertTrainerInBatch(batch.getId(), trainer.getId());

        String token = UUID.randomUUID().toString().replace("-", "");
        batch.setInviteToken(token);
        batch = batchRepository.save(batch);
        log.info("Invite token generated for batch {}", batchId);
        return toResponse(batch);
    }

    @Transactional
    public BatchResponse joinBatch(UUID batchId, String inviteToken, User student) {
        Batch batch = batchRepository.findByInviteToken(inviteToken)
                .orElseThrow(() -> new ResourceNotFoundException("Batch with invite token not found"));

        if (!batch.getId().equals(batchId)) {
            throw new IllegalStateException("Invite token does not match batch");
        }
        if (batchStudentRepository.existsByBatchIdAndStudentId(batchId, student.getId())) {
            throw new IllegalStateException("Student already in this batch");
        }

        BatchStudent bs = new BatchStudent(batchId, student.getId(), null, null);
        batchStudentRepository.save(bs);
        log.info("Student {} joined batch {}", student.getName(), batchId);
        return toResponse(batch);
    }

    public List<BatchResponse> getBatchesForTrainer(UUID trainerId) {
        return batchTrainerRepository.findByTrainerId(trainerId).stream()
                .map(bt -> toResponse(bt.getBatch()))
                .collect(Collectors.toList());
    }

    public List<BatchResponse> getBatchesForStudent(UUID studentId) {
        return batchStudentRepository.findByStudentId(studentId).stream()
                .map(bs -> toResponse(bs.getBatch()))
                .collect(Collectors.toList());
    }

    public List<BatchResponse> getBatchesForInstitution(UUID institutionId) {
        return batchRepository.findByInstitutionId(institutionId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BatchResponse> getAllBatches() {
        return batchRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private Batch getBatchOrThrow(UUID id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch", id));
    }

    private void assertTrainerInBatch(UUID batchId, UUID trainerId) {
        if (!batchTrainerRepository.existsByBatchIdAndTrainerId(batchId, trainerId)) {
            throw new RbacNotInBatchException("Trainer is not assigned to this batch");
        }
    }

    private BatchResponse toResponse(Batch b) {
        return BatchResponse.builder()
                .id(b.getId())
                .name(b.getName())
                .institutionId(b.getInstitution().getId())
                .institutionName(b.getInstitution().getName())
                .inviteToken(b.getInviteToken())
                .createdAt(b.getCreatedAt())
                .build();
    }

    public static class RbacNotInBatchException extends RuntimeException {
        public RbacNotInBatchException(String msg) { super(msg); }
    }
}
