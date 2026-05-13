package org.example.contentservice.services.implementing;

import org.example.contentservice.entities.Content;
import org.example.contentservice.repositories.ContentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContentServiceImplTest {

    @Mock
    private ContentRepository contentRepository;

    @InjectMocks
    private ContentServiceImpl contentService;

    private Content content1;
    private Content content2;

    @BeforeEach
    void setUp() {
        content1 = new Content();
        content1.setContentId(1);
        content1.setTitle("Title 1");
        content1.setDescription("Description 1");

        content2 = new Content();
        content2.setContentId(2);
        content2.setTitle("Title 2");
        content2.setDescription("Description 2");
        content2.setLevel(Content.ContentLevel.AVANCE);
    }

    @Test
    void retrieveAllContents() {
        when(contentRepository.findAll()).thenReturn(Arrays.asList(content1, content2));

        List<Content> contents = contentService.retrieveAllContents();

        assertNotNull(contents);
        assertEquals(2, contents.size());
        assertEquals(Content.ContentLevel.DEBUTANT, contents.get(0).getLevel()); // Default level check
        assertEquals(Content.ContentLevel.AVANCE, contents.get(1).getLevel());
        verify(contentRepository, times(1)).findAll();
    }

    @Test
    void addContent() {
        when(contentRepository.save(any(Content.class))).thenReturn(content1);

        Content savedContent = contentService.addContent(content1);

        assertNotNull(savedContent);
        assertNotNull(savedContent.getCreatedAt());
        assertNotNull(savedContent.getUpdatedAt());
        assertEquals(Content.ContentLevel.DEBUTANT, savedContent.getLevel());
        verify(contentRepository, times(1)).save(any(Content.class));
    }

    @Test
    void updateContent() {
        when(contentRepository.save(any(Content.class))).thenReturn(content2);

        Content updatedContent = contentService.updateContent(content2);

        assertNotNull(updatedContent);
        assertNotNull(updatedContent.getUpdatedAt());
        assertEquals(Content.ContentLevel.AVANCE, updatedContent.getLevel());
        verify(contentRepository, times(1)).save(any(Content.class));
    }

    @Test
    void retrieveContent() {
        when(contentRepository.findById(1)).thenReturn(Optional.of(content1));

        Content retrievedContent = contentService.retrieveContent(1);

        assertNotNull(retrievedContent);
        assertEquals("Title 1", retrievedContent.getTitle());
        assertEquals(Content.ContentLevel.DEBUTANT, retrievedContent.getLevel());
        verify(contentRepository, times(1)).findById(1);
    }

    @Test
    void retrieveContent_NotFound() {
        when(contentRepository.findById(3)).thenReturn(Optional.empty());

        Content retrievedContent = contentService.retrieveContent(3);

        assertNull(retrievedContent);
        verify(contentRepository, times(1)).findById(3);
    }

    @Test
    void deleteContent() {
        doNothing().when(contentRepository).deleteById(1);

        contentService.deleteContent(1);

        verify(contentRepository, times(1)).deleteById(1);
    }
}
