package com.matchy.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Bound from `matchy.jwt.secret` in application.properties.
 * Must match the JWT_SECRET env var used by the Node auth backend.
 */
@ConfigurationProperties(prefix = "matchy.jwt")
public class JwtProperties {

    private String secret = "dev-shared-secret-change-me-please-please-please-32bytes";

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }
}
