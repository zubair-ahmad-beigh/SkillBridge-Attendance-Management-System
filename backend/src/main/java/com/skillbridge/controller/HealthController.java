package com.skillbridge.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Slf4j
public class HealthController {

    private final DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("timestamp", Instant.now());
        result.put("status", "UP");

        // Test DB connection explicitly
        try (Connection conn = dataSource.getConnection()) {
            result.put("database", "CONNECTED");
            result.put("dbUrl", conn.getMetaData().getURL());
            result.put("dbProduct", conn.getMetaData().getDatabaseProductName());
            result.put("dbVersion", conn.getMetaData().getDatabaseProductVersion());
            log.info("Health check: DB connected OK");
        } catch (Exception e) {
            result.put("database", "FAILED");
            result.put("dbError", e.getClass().getSimpleName() + ": " + e.getMessage());
            log.error("Health check: DB connection FAILED", e);
            return ResponseEntity.status(503).body(result);
        }

        return ResponseEntity.ok(result);
    }
}
