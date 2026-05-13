package com.matchy.service.impl;

import com.matchy.dto.EvenementCreateDTO;
import com.matchy.dto.EvenementDTO;
import com.matchy.entity.Evenement;
import com.matchy.exception.ResourceNotFoundException;
import com.matchy.repository.EvenementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EvenementServiceImplTest {

    @Mock
    private EvenementRepository evenementRepository;

    @InjectMocks
    private EvenementServiceImpl evenementService;

    private Evenement evenement;
    private EvenementCreateDTO createDTO;

    @BeforeEach
    void setUp() {
        evenement = new Evenement();
        evenement.setId(1L);
        evenement.setTitle("Tech Conference");
        evenement.setMaxParticipants(100);
        evenement.setCurrentParticipants(0);
        evenement.setType(Evenement.EvenementType.CONFERENCE);

        createDTO = new EvenementCreateDTO();
        createDTO.setTitle("Tech Conference");
        createDTO.setMaxParticipants(100);
        createDTO.setType(Evenement.EvenementType.CONFERENCE);
    }

    @Test
    void createEvenement() {
        when(evenementRepository.save(any(Evenement.class))).thenReturn(evenement);

        EvenementDTO result = evenementService.createEvenement(createDTO);

        assertNotNull(result);
        assertEquals("Tech Conference", result.getTitle());
        verify(evenementRepository, times(1)).save(any(Evenement.class));
    }

    @Test
    void updateEvenement() {
        when(evenementRepository.findById(1L)).thenReturn(Optional.of(evenement));
        when(evenementRepository.save(any(Evenement.class))).thenReturn(evenement);

        EvenementDTO result = evenementService.updateEvenement(1L, createDTO);

        assertNotNull(result);
        assertEquals("Tech Conference", result.getTitle());
        verify(evenementRepository, times(1)).findById(1L);
        verify(evenementRepository, times(1)).save(any(Evenement.class));
    }

    @Test
    void deleteEvenement() {
        when(evenementRepository.existsById(1L)).thenReturn(true);
        doNothing().when(evenementRepository).deleteById(1L);

        evenementService.deleteEvenement(1L);

        verify(evenementRepository, times(1)).existsById(1L);
        verify(evenementRepository, times(1)).deleteById(1L);
    }

    @Test
    void getEvenementById() {
        when(evenementRepository.findById(1L)).thenReturn(Optional.of(evenement));

        EvenementDTO result = evenementService.getEvenementById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(evenementRepository, times(1)).findById(1L);
    }

    @Test
    void getAllEvenements() {
        when(evenementRepository.findAll()).thenReturn(Arrays.asList(evenement));

        List<EvenementDTO> result = evenementService.getAllEvenements();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(evenementRepository, times(1)).findAll();
    }

    @Test
    void participateInEvenement() {
        when(evenementRepository.findById(1L)).thenReturn(Optional.of(evenement));
        when(evenementRepository.save(any(Evenement.class))).thenReturn(evenement);

        EvenementDTO result = evenementService.participateInEvenement(1L);

        assertNotNull(result);
        assertEquals(1, evenement.getCurrentParticipants());
        verify(evenementRepository, times(1)).save(any(Evenement.class));
    }

    @Test
    void participateInEvenement_Full() {
        evenement.setCurrentParticipants(100);
        when(evenementRepository.findById(1L)).thenReturn(Optional.of(evenement));

        assertThrows(RuntimeException.class, () -> evenementService.participateInEvenement(1L));
    }

    @Test
    void cancelParticipation() {
        evenement.setCurrentParticipants(1);
        when(evenementRepository.findById(1L)).thenReturn(Optional.of(evenement));
        when(evenementRepository.save(any(Evenement.class))).thenReturn(evenement);

        EvenementDTO result = evenementService.cancelParticipation(1L);

        assertNotNull(result);
        assertEquals(0, evenement.getCurrentParticipants());
        verify(evenementRepository, times(1)).save(any(Evenement.class));
    }
}
