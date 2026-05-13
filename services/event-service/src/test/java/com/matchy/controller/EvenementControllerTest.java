package com.matchy.controller;

import com.matchy.dto.EvenementCreateDTO;
import com.matchy.dto.EvenementDTO;
import com.matchy.entity.Evenement;
import com.matchy.service.EvenementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class EvenementControllerTest {

    @Mock
    private EvenementService evenementService;

    @InjectMocks
    private EvenementController evenementController;

    private EvenementDTO evenementDTO;
    private EvenementCreateDTO createDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        evenementDTO = new EvenementDTO();
        evenementDTO.setId(1L);
        evenementDTO.setTitle("Tech Conference");

        createDTO = new EvenementCreateDTO();
        createDTO.setTitle("Tech Conference");
    }

    @Test
    void getAllEvenements() {
        when(evenementService.getAllEvenements()).thenReturn(Arrays.asList(evenementDTO));

        ResponseEntity<List<EvenementDTO>> response = evenementController.getAllEvenements();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getEvenementById() {
        when(evenementService.getEvenementById(1L)).thenReturn(evenementDTO);

        ResponseEntity<EvenementDTO> response = evenementController.getEvenementById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evenementDTO, response.getBody());
    }

    @Test
    void createEvenement() {
        when(evenementService.createEvenement(any(EvenementCreateDTO.class))).thenReturn(evenementDTO);

        ResponseEntity<EvenementDTO> response = evenementController.createEvenement(createDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(evenementDTO, response.getBody());
    }

    @Test
    void updateEvenement() {
        when(evenementService.updateEvenement(eq(1L), any(EvenementCreateDTO.class))).thenReturn(evenementDTO);

        ResponseEntity<EvenementDTO> response = evenementController.updateEvenement(1L, createDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evenementDTO, response.getBody());
    }

    @Test
    void deleteEvenement() {
        doNothing().when(evenementService).deleteEvenement(1L);

        ResponseEntity<Void> response = evenementController.deleteEvenement(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(evenementService, times(1)).deleteEvenement(1L);
    }

    @Test
    void participate() {
        when(evenementService.participateInEvenement(1L)).thenReturn(evenementDTO);

        ResponseEntity<EvenementDTO> response = evenementController.participate(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evenementDTO, response.getBody());
    }

    @Test
    void cancelParticipation() {
        when(evenementService.cancelParticipation(1L)).thenReturn(evenementDTO);

        ResponseEntity<EvenementDTO> response = evenementController.cancelParticipation(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(evenementDTO, response.getBody());
    }
}
