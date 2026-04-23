package com.skillbridge.exception;

import com.skillbridge.security.RbacGuard;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @Value("${app.dev-mode:false}")
    private boolean devMode;

    @ExceptionHandler(RbacGuard.AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(RbacGuard.AccessDeniedException ex) {
        log.warn("RBAC denial: {}", ex.getMessage());
        return error(HttpStatus.FORBIDDEN, ex.getMessage(), null);
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, Object>> handleSecurity(SecurityException ex) {
        log.warn("Security error: {}", ex.getMessage());
        return error(HttpStatus.UNAUTHORIZED, ex.getMessage(), null);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Not found: {}", ex.getMessage());
        return error(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(fe -> fieldErrors.put(fe.getField(), fe.getDefaultMessage()));
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Validation failed");
        body.put("details", fieldErrors);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {
        return error(HttpStatus.CONFLICT, ex.getMessage(), null);
    }

    // ─── Catch-all — always logs full stack, exposes detail in dev mode ────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        log.error("Unhandled exception [{}]: {}", ex.getClass().getName(), ex.getMessage(), ex);

        // In dev mode, return the real error so it's easy to debug
        String message = devMode
                ? ex.getClass().getSimpleName() + ": " + ex.getMessage()
                : "An internal error occurred";

        // Always include cause chain in response for debugging
        String cause = null;
        if (devMode && ex.getCause() != null) {
            cause = ex.getCause().getClass().getSimpleName() + ": " + ex.getCause().getMessage();
        }

        return error(HttpStatus.INTERNAL_SERVER_ERROR, message, cause);
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message, String cause) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now());
        body.put("status", status.value());
        body.put("error", message);
        if (cause != null) body.put("cause", cause);
        return ResponseEntity.status(status).body(body);
    }
}
