package com.matchy.client;

import com.matchy.dto.SubscriptionStatusDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign client for inter-service communication with subscription-service.
 * Used by event-service to verify user subscription status before allowing
 * registration to premium/restricted events.
 */
@FeignClient(name = "subscription-service", path = "/api/subscription")
public interface SubscriptionFeignClient {

    /**
     * Retrieve all subscriptions for a given user.
     */
    @GetMapping("/user/{userId}")
    List<SubscriptionStatusDTO> getSubscriptionsByUser(@PathVariable("userId") Long userId);

    /**
     * Check if a user has an active (non-free) subscription.
     * Calls the internal endpoint exposed by subscription-service.
     */
    @GetMapping("/user/{userId}/active")
    SubscriptionStatusDTO getActiveSubscription(@PathVariable("userId") Long userId);
}
