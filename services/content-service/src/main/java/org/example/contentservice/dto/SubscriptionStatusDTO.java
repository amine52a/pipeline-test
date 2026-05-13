package org.example.contentservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Lightweight DTO representing a subscription as returned by subscription-service.
 * Only the fields needed by content-service are mapped; unknown fields are ignored.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SubscriptionStatusDTO {

    private Long id;
    private Long userId;
    private String status;       // ACTIVE, TRIAL, PENDING, CANCELLED, EXPIRED
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isTrial;

    /**
     * The plan object as returned by subscription-service.
     * Contains at minimum { "id": ..., "name": "PRO"|"PREMIUM"|"FREE" }
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Map<String, Object> plan;

    /** Convenience accessor for the plan name. */
    public String getPlanName() {
        if (plan == null) return null;
        Object name = plan.get("name");
        return name == null ? null : String.valueOf(name);
    }

    /** Returns true if the subscription grants access (ACTIVE or TRIAL). */
    public boolean isAccessGranted() {
        return "ACTIVE".equalsIgnoreCase(status) || "TRIAL".equalsIgnoreCase(status);
    }

    /** Returns true if the plan is a paid tier (PRO or PREMIUM). */
    public boolean isPaidPlan() {
        String name = getPlanName();
        return "PRO".equalsIgnoreCase(name) || "PREMIUM".equalsIgnoreCase(name);
    }
}
