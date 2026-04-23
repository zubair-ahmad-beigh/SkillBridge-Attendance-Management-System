package com.skillbridge.security;

import com.skillbridge.entity.User;
import com.skillbridge.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

/**
 * Resolves the authenticated Clerk user's DB record and stores it
 * as a request attribute ("currentUser") for use in controllers/services.
 * Only active in production (not in dev profile).
 */
@Component
@Profile("prod")
@RequiredArgsConstructor
@Slf4j
public class UserContextFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            String clerkUserId = jwt.getSubject();
            Optional<User> userOpt = userRepository.findByClerkUserId(clerkUserId);
            if (userOpt.isPresent()) {
                request.setAttribute("currentUser", userOpt.get());
                log.debug("Resolved user {} with role {}", clerkUserId, userOpt.get().getRole());
            } else {
                log.warn("Clerk user {} not found in local DB", clerkUserId);
            }
        }

        filterChain.doFilter(request, response);
    }
}
