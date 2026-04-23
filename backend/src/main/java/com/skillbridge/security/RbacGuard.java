package com.skillbridge.security;

import com.skillbridge.entity.Role;
import com.skillbridge.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Utility to enforce Role-Based Access Control.
 * Call assertRole() at the start of service methods or controllers.
 */
@Component
public class RbacGuard {

    public User currentUser(HttpServletRequest request) {
        User user = (User) request.getAttribute("currentUser");
        if (user == null) {
            throw new SecurityException("User not authenticated or not synced");
        }
        return user;
    }

    public User assertRole(HttpServletRequest request, Role... allowedRoles) {
        User user = currentUser(request);
        boolean allowed = Arrays.asList(allowedRoles).contains(user.getRole());
        if (!allowed) {
            throw new AccessDeniedException("Role " + user.getRole() + " is not permitted for this action");
        }
        return user;
    }

    public static class AccessDeniedException extends RuntimeException {
        public AccessDeniedException(String msg) { super(msg); }
    }
}
