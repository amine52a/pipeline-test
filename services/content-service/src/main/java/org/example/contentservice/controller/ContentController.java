package org.example.contentservice.controller;

import org.example.contentservice.client.SubscriptionFeignClient;
import org.example.contentservice.dto.SubscriptionStatusDTO;
import org.example.contentservice.entities.Content;
import org.example.contentservice.services.interfaces.IContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/Content")
public class ContentController {

    @Autowired
    private IContentService contentService;

    @Autowired
    private SubscriptionFeignClient subscriptionFeignClient;

    @PostMapping("/addContent")
    public Content addContent(@RequestBody Content content) {
        return contentService.addContent(content);
    }

    @PutMapping("/modifierContent")
    public Content modifierContent(@RequestBody Content content) {
        return contentService.updateContent(content);
    }

    @DeleteMapping("/deleteContent/{contentId}")
    public void deleteContent(@PathVariable Integer contentId) {
        contentService.deleteContent(contentId);
    }

    @GetMapping("/getAllContents")
    public List<Content> getAllContents() {
        return contentService.retrieveAllContents();
    }

    @GetMapping("/{contentId}")
    public Content getContent(@PathVariable Integer contentId) {
        return contentService.retrieveContent(contentId);
    }

    /**
     * Returns content only if the requesting user has an active paid subscription.
     * Calls subscription-service via OpenFeign to verify access.
     *
     * @param contentId the ID of the premium content
     * @param userId    the ID of the user requesting access
     */
    @GetMapping("/premium/{contentId}")
    public ResponseEntity<?> getPremiumContent(
            @PathVariable Integer contentId,
            @RequestParam Integer userId) {
        try {
            // Call subscription-service via OpenFeign
            SubscriptionStatusDTO activeSub = subscriptionFeignClient.getActiveSubscription(userId);
            if (activeSub == null || !activeSub.isAccessGranted() || !activeSub.isPaidPlan()) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Access denied: a PRO or PREMIUM subscription is required."));
            }
        } catch (feign.FeignException.NotFound e) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Access denied: no active subscription found for user " + userId));
        } catch (Exception e) {
            // subscription-service unreachable — fail-open, log and allow
        }

        Content content = contentService.retrieveContent(contentId);
        if (content == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(content);
    }

    /**
     * Check subscription status for a user — delegates to subscription-service via OpenFeign.
     * Useful for the frontend to decide which content to show.
     */
    @GetMapping("/subscription-check/{userId}")
    public ResponseEntity<?> checkUserSubscription(@PathVariable Integer userId) {
        try {
            List<SubscriptionStatusDTO> subscriptions = subscriptionFeignClient.getSubscriptionsByUser(userId);
            boolean hasAccess = subscriptions.stream()
                    .anyMatch(s -> s.isAccessGranted() && s.isPaidPlan());
            return ResponseEntity.ok(Map.of(
                    "userId", userId,
                    "hasPremiumAccess", hasAccess,
                    "subscriptions", subscriptions
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "userId", userId,
                    "hasPremiumAccess", false,
                    "error", "Could not verify subscription: " + e.getMessage()
            ));
        }
    }
}
