package tn.esprit.matchy_sub.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Client to fetch user information from the Matchy node backend (matchy_db).
 * The Subscription microservice does NOT store users locally — it relies on
 * matchy backend as the single source of truth.
 */
@Component
@Slf4j
public class UserClient {

    private final RestTemplate restTemplate;

    @Value("${matchy.backend.url:http://localhost:9090/api}")
    private String matchyBackendUrl;

    public UserClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetch user info from matchy backend.
     * Returns map: { id, fullName, name, email, role, avatar, status, ... } or null.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getUser(Long userId) {
        if (userId == null) return null;
        try {
            return restTemplate.getForObject(matchyBackendUrl + "/users/" + userId, Map.class);
        } catch (Exception e) {
            log.warn("UserClient: failed to fetch user {} from {}: {}", userId, matchyBackendUrl, e.getMessage());
            return null;
        }
    }

    public String getUserName(Long userId) {
        Map<String, Object> u = getUser(userId);
        if (u == null) return null;
        Object name = u.getOrDefault("name", u.get("fullName"));
        return name == null ? null : String.valueOf(name);
    }

    public String getUserEmail(Long userId) {
        Map<String, Object> u = getUser(userId);
        if (u == null) return null;
        Object email = u.get("email");
        return email == null ? null : String.valueOf(email);
    }
}
