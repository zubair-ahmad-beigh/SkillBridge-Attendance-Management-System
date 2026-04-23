package com.skillbridge.service;

import com.skillbridge.dto.request.UserSyncRequest;
import com.skillbridge.dto.response.UserResponse;
import com.skillbridge.entity.Institution;
import com.skillbridge.entity.User;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.InstitutionRepository;
import com.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;

    @Transactional
    public UserResponse syncUser(UserSyncRequest req) {
        // Idempotent: if user already exists, update and return
        User user = userRepository.findByClerkUserId(req.getClerkUserId())
                .orElseGet(User::new);

        user.setClerkUserId(req.getClerkUserId());
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setRole(req.getRole());

        if (req.getInstitutionId() != null) {
            Institution inst = institutionRepository.findById(UUID.fromString(req.getInstitutionId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Institution", req.getInstitutionId()));
            user.setInstitution(inst);
        }

        user = userRepository.save(user);
        log.info("User synced: {} ({})", user.getName(), user.getRole());
        return toResponse(user);
    }

    public UserResponse getMe(User currentUser) {
        return toResponse(currentUser);
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .clerkUserId(u.getClerkUserId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .institutionId(u.getInstitution() != null ? u.getInstitution().getId() : null)
                .createdAt(u.getCreatedAt())
                .build();
    }
}
