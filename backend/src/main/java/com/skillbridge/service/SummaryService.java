package com.skillbridge.service;

import com.skillbridge.dto.response.BatchSummaryResponse;
import com.skillbridge.dto.response.InstitutionSummaryResponse;
import com.skillbridge.entity.*;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SummaryService {

    private final BatchRepository batchRepository;
    private final InstitutionRepository institutionRepository;
    private final SessionRepository sessionRepository;
    private final BatchStudentRepository batchStudentRepository;
    private final BatchTrainerRepository batchTrainerRepository;
    private final AttendanceRepository attendanceRepository;

    public BatchSummaryResponse getBatchSummary(UUID batchId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch", batchId));

        long totalSessions = sessionRepository.findByBatchId(batchId).size();
        long totalStudents = batchStudentRepository.findByBatchId(batchId).size();
        long totalMarked = attendanceRepository.countByBatchId(batchId);
        long presentCount = attendanceRepository.countByBatchIdAndStatus(batchId, AttendanceStatus.PRESENT);
        long absentCount = attendanceRepository.countByBatchIdAndStatus(batchId, AttendanceStatus.ABSENT);
        long lateCount = attendanceRepository.countByBatchIdAndStatus(batchId, AttendanceStatus.LATE);
        double rate = totalMarked > 0 ? (presentCount * 100.0 / totalMarked) : 0.0;

        return BatchSummaryResponse.builder()
                .batchId(batchId)
                .batchName(batch.getName())
                .totalSessions(totalSessions)
                .totalStudents(totalStudents)
                .totalAttendanceMarked(totalMarked)
                .presentCount(presentCount)
                .absentCount(absentCount)
                .lateCount(lateCount)
                .attendanceRate(Math.round(rate * 100.0) / 100.0)
                .build();
    }

    public InstitutionSummaryResponse getInstitutionSummary(UUID institutionId) {
        Institution institution = institutionRepository.findById(institutionId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", institutionId));

        List<Batch> batches = batchRepository.findByInstitutionId(institutionId);
        List<BatchSummaryResponse> batchSummaries = batches.stream()
                .map(b -> getBatchSummary(b.getId()))
                .collect(Collectors.toList());

        long totalTrainers = batches.stream()
                .flatMap(b -> batchTrainerRepository.findByBatchId(b.getId()).stream())
                .map(BatchTrainer::getTrainerId)
                .distinct().count();

        long totalStudents = batches.stream()
                .flatMap(b -> batchStudentRepository.findByBatchId(b.getId()).stream())
                .map(BatchStudent::getStudentId)
                .distinct().count();

        return InstitutionSummaryResponse.builder()
                .institutionId(institutionId)
                .institutionName(institution.getName())
                .totalBatches(batches.size())
                .totalTrainers(totalTrainers)
                .totalStudents(totalStudents)
                .batches(batchSummaries)
                .build();
    }

    public List<InstitutionSummaryResponse> getProgrammeSummary() {
        return institutionRepository.findAll().stream()
                .map(inst -> getInstitutionSummary(inst.getId()))
                .collect(Collectors.toList());
    }
}
