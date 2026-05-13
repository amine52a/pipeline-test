package com.matchy.security;

import jakarta.servlet.http.HttpServletRequest;

public final class AuthContext {

    private AuthContext() {}

    /** @return the user id from the JWT, or null if no valid token was supplied. */
    public static Long currentUserId(HttpServletRequest request) {
        Object v = request.getAttribute(JwtAuthFilter.ATTR_USER_ID);
        return v instanceof Long ? (Long) v : null;
    }

    public static String currentUserRole(HttpServletRequest request) {
        Object v = request.getAttribute(JwtAuthFilter.ATTR_USER_ROLE);
        return v != null ? v.toString() : null;
    }

    public static Long requireUserId(HttpServletRequest request) {
        Long id = currentUserId(request);
        if (id == null) {
            throw new SecurityException("Authentication required");
        }
        return id;
    }
}
