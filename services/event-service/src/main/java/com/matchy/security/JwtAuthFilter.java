package com.matchy.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Validates the Bearer token on every request and exposes:
 *   request.getAttribute("userId") -> Long
 *   request.getAttribute("userRole") -> String
 *
 * The token is the same JWT issued by the Node auth backend, signed with
 * the shared `matchy.jwt.secret`. Requests without a token are still allowed
 * through (controllers decide what to require) but no attributes are set.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    public static final String ATTR_USER_ID = "userId";
    public static final String ATTR_USER_ROLE = "userRole";

    private final SecretKey key;

    public JwtAuthFilter(JwtProperties props) {
        this.key = Keys.hmacShaKeyFor(props.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                Object sub = claims.getSubject();
                if (sub != null) {
                    try {
                        request.setAttribute(ATTR_USER_ID, Long.valueOf(sub.toString()));
                    } catch (NumberFormatException ignored) {
                        // sub not numeric — leave userId unset
                    }
                }
                Object role = claims.get("role");
                if (role != null) {
                    request.setAttribute(ATTR_USER_ROLE, role.toString());
                }
            } catch (Exception ex) {
                // Invalid/expired token — silently ignore; endpoints requiring auth
                // will reject because the attributes won't be populated.
            }
        }
        chain.doFilter(request, response);
    }
}
