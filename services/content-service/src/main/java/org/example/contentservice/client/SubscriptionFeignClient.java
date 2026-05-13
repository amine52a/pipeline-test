package org.example.contentservice.client;

import org.example.contentservice.dto.SubscriptionStatusDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign client for inter-service communication with subscription-service.
 * Used by content-service to verify whether a user has an active paid subscription
 * before granting access to premium content.
 */
@FeignClient(name = "subscription-service", path = "/api/subscription")
public interface SubscriptionFeignClient {

    /**
     * Retrieve all subscriptions for a given user.
     */
    @GetMapping("/user/{userId}")
    List<SubscriptionStatusDTO> getSubscriptionsByUser(@PathVariable("userId") Integer userId);

    /**
     * Get the active subscription for a user (ACTIVE or TRIAL status).
     */
    @GetMapping("/user/{userId}/active")
    SubscriptionStatusDTO getActiveSubscription(@PathVariable("userId") Integer userId);
}
