package org.example.contentservice.controller;

import org.example.contentservice.client.SubscriptionFeignClient;
import org.example.contentservice.dto.SubscriptionStatusDTO;
import org.example.contentservice.entities.Content;
import org.example.contentservice.services.interfaces.IContentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

class ContentControllerTest {

    @Mock
    private IContentService contentService;

    @Mock
    private SubscriptionFeignClient subscriptionFeignClient;

    @InjectMocks
    private ContentController contentController;

    private Content content;
    private SubscriptionStatusDTO activeSub;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        content = new Content();
        content.setContentId(1);
        content.setTitle("Test Content");
        
        activeSub = new SubscriptionStatusDTO();
        activeSub.setId(1L);
        activeSub.setUserId(1L);
        activeSub.setStatus("ACTIVE");
        activeSub.setPlan(Map.of("name", "PRO"));
    }

    @Test
    void addContent() {
        when(contentService.addContent(any(Content.class))).thenReturn(content);

        Content response = contentController.addContent(content);

        assertNotNull(response);
        assertEquals(1, response.getContentId());
        verify(contentService, times(1)).addContent(any(Content.class));
    }

    @Test
    void modifierContent() {
        when(contentService.updateContent(any(Content.class))).thenReturn(content);

        Content response = contentController.modifierContent(content);

        assertNotNull(response);
        assertEquals("Test Content", response.getTitle());
        verify(contentService, times(1)).updateContent(any(Content.class));
    }

    @Test
    void deleteContent() {
        doNothing().when(contentService).deleteContent(1);

        contentController.deleteContent(1);

        verify(contentService, times(1)).deleteContent(1);
    }

    @Test
    void getAllContents() {
        when(contentService.retrieveAllContents()).thenReturn(Arrays.asList(content));

        List<Content> response = contentController.getAllContents();

        assertNotNull(response);
        assertEquals(1, response.size());
        verify(contentService, times(1)).retrieveAllContents();
    }

    @Test
    void getContent() {
        when(contentService.retrieveContent(1)).thenReturn(content);

        Content response = contentController.getContent(1);

        assertNotNull(response);
        assertEquals(1, response.getContentId());
        verify(contentService, times(1)).retrieveContent(1);
    }

    @Test
    void getPremiumContent_AccessGranted() {
        when(subscriptionFeignClient.getActiveSubscription(1)).thenReturn(activeSub);
        when(contentService.retrieveContent(1)).thenReturn(content);

        ResponseEntity<?> response = contentController.getPremiumContent(1, 1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(content, response.getBody());
    }

    @Test
    void getPremiumContent_AccessDenied() {
        SubscriptionStatusDTO inactiveSub = new SubscriptionStatusDTO();
        inactiveSub.setStatus("EXPIRED");
        inactiveSub.setPlan(Map.of("name", "FREE"));
        when(subscriptionFeignClient.getActiveSubscription(1)).thenReturn(inactiveSub);

        ResponseEntity<?> response = contentController.getPremiumContent(1, 1);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertTrue(((Map<?, ?>) response.getBody()).containsKey("error"));
    }

    @Test
    void checkUserSubscription_HasAccess() {
        when(subscriptionFeignClient.getSubscriptionsByUser(1))
                .thenReturn(Collections.singletonList(activeSub));

        ResponseEntity<?> response = contentController.checkUserSubscription(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(true, body.get("hasPremiumAccess"));
    }

    @Test
    void checkUserSubscription_NoAccess() {
        SubscriptionStatusDTO inactiveSub = new SubscriptionStatusDTO();
        inactiveSub.setStatus("EXPIRED");
        inactiveSub.setPlan(Map.of("name", "FREE"));
        when(subscriptionFeignClient.getSubscriptionsByUser(1))
                .thenReturn(Collections.singletonList(inactiveSub));

        ResponseEntity<?> response = contentController.checkUserSubscription(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(false, body.get("hasPremiumAccess"));
    }
}
