package com.skillbridge.controller;

import com.skillbridge.dto.request.UserSyncRequest;
import com.skillbridge.dto.response.UserResponse;
import com.skillbridge.entity.User;
import com.skillbridge.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * POST /api/users/sync
     * Called by frontend after Clerk signup to persist the user in the DB.
     * This endpoint is PUBLIC (no JWT required).
     */
    @PostMapping("/sync")
    public ResponseEntity<UserResponse> syncUser(@Valid @RequestBody UserSyncRequest req) {
        return ResponseEntity.ok(userService.syncUser(req));
    }

    /**
     * GET /api/users/me
     * Returns the currently authenticated user's profile.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.getMe(currentUser));
    }
}
