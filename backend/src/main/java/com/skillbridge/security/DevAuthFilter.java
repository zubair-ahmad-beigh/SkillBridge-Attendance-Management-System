package com.skillbridge.security;

import com.skillbridge.entity.Institution;
import com.skillbridge.entity.Role;
import com.skillbridge.entity.User;
import com.skillbridge.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * DEV MODE ONLY — bypasses Clerk JWT.
 * Send these headers to authenticate:
 *   X-Dev-Role: STUDENT | TRAINER | INSTITUTION | PROGRAMME_MANAGER | MONITORING_OFFICER
 *   X-Dev-User-Id: any-uuid (optional, auto-generated if missing)
 *   X-Dev-User-Name: John Doe (optional)
 */
@Component
@Profile("!prod")
@RequiredArgsConstructor
@Slf4j
public class DevAuthFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String roleHeader = request.getHeader("X-Dev-Role");

        if (roleHeader != null) {
            try {
                Role role = Role.valueOf(roleHeader.toUpperCase());
                String clerkId = "dev-" + roleHeader.toLowerCase();
                String name = request.getHeader("X-Dev-User-Name") != null
                        ? request.getHeader("X-Dev-User-Name")
                        : "Dev " + roleHeader;

                // Upsert dev user
                User user = userRepository.findByClerkUserId(clerkId).orElseGet(() -> {
                    User u = new User();
                    u.setClerkUserId(clerkId);
                    u.setName(name);
                    u.setEmail(roleHeader.toLowerCase() + "@dev.local");
                    u.setRole(role);
                    return userRepository.save(u);
                });

                request.setAttribute("currentUser", user);

                // Set Spring Security authentication
                var auth = new UsernamePasswordAuthenticationToken(
                        clerkId, null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.debug("[DEV] Authenticated as {} ({})", name, role);

            } catch (IllegalArgumentException e) {
                log.warn("[DEV] Unknown role header: {}", roleHeader);
            }
        }

        filterChain.doFilter(request, response);
    }
}
