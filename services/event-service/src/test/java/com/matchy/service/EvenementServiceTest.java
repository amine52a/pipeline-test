package com.matchy.service;

import com.matchy.dto.EvenementCreateDTO;
import com.matchy.dto.EvenementDTO;
import com.matchy.entity.Evenement;
import com.matchy.exception.ResourceNotFoundException;
import com.matchy.repository.EvenementRepository;
import com.matchy.service.impl.EvenementServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EvenementService — Unit Tests")
class EvenementServiceTest {

    @Mock EvenementRepository evenementRepository;
    @InjectMocks EvenementServiceImpl evenementService;

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Evenement buildEvenement(Long id, String title, Evenement.EvenementType type) {
        Evenement e = new Evenement();
        e.setId(id);
        e.setTitle(title);
        e.setDescription("Description for " + title);
        e.setDate(LocalDateTime.now().plusDays(7));
        e.setLocation("Tunis");
        e.setType(type);
        e.setMaxParticipants(100);
        e.setCurrentParticipants(0);
        e.setStatus("ACTIVE");
        return e;
    }

    private EvenementCreateDTO buildCreateDTO(String title, Evenement.EvenementType type) {
        EvenementCreateDTO dto = new EvenementCreateDTO();
        dto.setTitle(title);
        dto.setDescription("Description");
        dto.setDate(LocalDateTime.now().plusDays(7));
        dto.setLocation("Tunis");
        dto.setType(type);
        dto.setMaxParticipants(100);
        return dto;
    }

    // ── CRUD Tests ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("createEvenement() — creates event with ACTIVE status")
    void createEvenement_createsWithActiveStatus() {
        EvenementCreateDTO dto = buildCreateDTO("Tech Conference", Evenement.EvenementType.CONFERENCE);
        Evenement saved = buildEvenement(1L, "Tech Conference", Evenement.EvenementType.CONFERENCE);

        when(evenementRepository.save(any(Evenement.class))).thenReturn(saved);

        EvenementDTO result = evenementService.createEvenement(dto);

        assertThat(result.getTitle()).isEqualTo("Tech Conference");
        assertThat(result.getStatus()).isEqualTo("ACTIVE");
        assertThat(result.getCurrentParticipants()).isEqualTo(0);
        verify(evenementRepository).save(any(Evenement.class));
    }

    @Test
    @DisplayName("getEvenementById() — returns DTO when found")
    void getEvenementById_returnsDTO() {
        Evenement e = buildEvenement(1L, "Workshop", Evenement.EvenementType.WORKSHOP);
        when(evenementRepository.findById(1L)).thenReturn(Optional.of(e));

        EvenementDTO result = evenementService.getEvenementById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Workshop");
        assertThat(result.getType()).isEqualTo(Evenement.EvenementType.WORKSHOP);
    }

    @Test
    @DisplayName("getEvenementById() — throws ResourceNotFoundException when not found")
    void getEvenementById_throwsWhenNotFound() {
        when(evenementRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> evenementService.getEvenementById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("getAllEvenements() — returns all events as DTOs")
    void getAllEvenements_returnsAll() {
        List<Evenement> events = List.of(
                buildEvenement(1L, "Event 1", Evenement.EvenementType.CONFERENCE),
                buildEvenement(2L, "Event 2", Evenement.EvenementType.WORKSHOP),
                buildEvenement(3L, "Event 3", Evenement.EvenementType.WEBINAR)
        );
        when(evenementRepository.findAll()).thenReturn(events);

        List<EvenementDTO> result = evenementService.getAllEvenements();

        assertThat(result).hasSize(3);
        assertThat(result).extracting(EvenementDTO::getTitle)
                .containsExactly("Event 1", "Event 2", "Event 3");
    }

    @Test
    @DisplayName("updateEvenement() — updates fields correctly")
    void updateEvenement_updatesFields() {
        Evenement existing = buildEvenement(1L, "Old Title", Evenement.EvenementType.CONFERENCE);
        EvenementCreateDTO updateDTO = buildCreateDTO("New Title", Evenement.EvenementType.WORKSHOP);

        when(evenementRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(evenementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        EvenementDTO result = evenementService.updateEvenement(1L, updateDTO);

        assertThat(result.getTitle()).isEqualTo("New Title");
        assertThat(result.getType()).isEqualTo(Evenement.EvenementType.WORKSHOP);
    }

    @Test
    @DisplayName("updateEvenement() — throws when event not found")
    void updateEvenement_throwsWhenNotFound() {
        when(evenementRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> evenementService.updateEvenement(99L, buildCreateDTO("X", Evenement.EvenementType.CONFERENCE)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("deleteEvenement() — deletes existing event")
    void deleteEvenement_deletesExisting() {
        when(evenementRepository.existsById(1L)).thenReturn(true);

        evenementService.deleteEvenement(1L);

        verify(evenementRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteEvenement() — throws when not found")
    void deleteEvenement_throwsWhenNotFound() {
        when(evenementRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> evenementService.deleteEvenement(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("getEvenementsByType() — filters by type")
    void getEvenementsByType_filtersByType() {
        List<Evenement> conferences = List.of(
                buildEvenement(1L, "Conf 1", Evenement.EvenementType.CONFERENCE),
                buildEvenement(2L, "Conf 2", Evenement.EvenementType.CONFERENCE)
        );
        when(evenementRepository.findByType(Evenement.EvenementType.CONFERENCE)).thenReturn(conferences);

        List<EvenementDTO> result = evenementService.getEvenementsByType(Evenement.EvenementType.CONFERENCE);

        assertThat(result).hasSize(2);
        assertThat(result).allMatch(e -> e.getType() == Evenement.EvenementType.CONFERENCE);
    }

    @Test
    @DisplayName("getUpcomingEvenements() — returns future events")
    void getUpcomingEvenements_returnsFutureEvents() {
        List<Evenement> upcoming = List.of(
                buildEvenement(1L, "Future Event", Evenement.EvenementType.WEBINAR)
        );
        when(evenementRepository.findByDateAfter(any(LocalDateTime.class))).thenReturn(upcoming);

        List<EvenementDTO> result = evenementService.getUpcomingEvenements();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDate()).isAfter(LocalDateTime.now());
    }

    // ── Business Logic Tests ──────────────────────────────────────────────────

    @Test
    @DisplayName("participateInEvenement() — increments participant count")
    void participateInEvenement_incrementsCount() {
        Evenement e = buildEvenement(1L, "Event", Evenement.EvenementType.CONFERENCE);
        e.setCurrentParticipants(5);
        e.setMaxParticipants(100);

        when(evenementRepository.findById(1L)).thenReturn(Optional.of(e));
        when(evenementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        EvenementDTO result = evenementService.participateInEvenement(1L);

        assertThat(result.getCurrentParticipants()).isEqualTo(6);
    }

    @Test
    @DisplayName("participateInEvenement() — throws when event is full")
    void participateInEvenement_throwsWhenFull() {
        Evenement e = buildEvenement(1L, "Full Event", Evenement.EvenementType.CONFERENCE);
        e.setMaxParticipants(10);
        e.setCurrentParticipants(10);

        when(evenementRepository.findById(1L)).thenReturn(Optional.of(e));

        assertThatThrownBy(() -> evenementService.participateInEvenement(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("full");
    }

    @Test
    @DisplayName("participateInEvenement() — allows unlimited when maxParticipants is null")
    void participateInEvenement_allowsUnlimitedWhenMaxNull() {
        Evenement e = buildEvenement(1L, "Unlimited Event", Evenement.EvenementType.WEBINAR);
        e.setMaxParticipants(null);
        e.setCurrentParticipants(999);

        when(evenementRepository.findById(1L)).thenReturn(Optional.of(e));
        when(evenementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        EvenementDTO result = evenementService.participateInEvenement(1L);

        assertThat(result.getCurrentParticipants()).isEqualTo(1000);
    }

    @Test
    @DisplayName("cancelParticipation() — decrements participant count")
    void cancelParticipation_decrementsCount() {
        Evenement e = buildEvenement(1L, "Event", Evenement.EvenementType.CONFERENCE);
        e.setCurrentParticipants(5);

        when(evenementRepository.findById(1L)).thenReturn(Optional.of(e));
        when(evenementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        EvenementDTO result = evenementService.cancelParticipation(1L);

        assertThat(result.getCurrentParticipants()).isEqualTo(4);
    }

    @Test
    @DisplayName("cancelParticipation() — does not go below 0")
    void cancelParticipation_doesNotGoBelowZero() {
        Evenement e = buildEvenement(1L, "Event", Evenement.EvenementType.CONFERENCE);
        e.setCurrentParticipants(0);

        when(evenementRepository.findById(1L)).thenReturn(Optional.of(e));
        when(evenementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        EvenementDTO result = evenementService.cancelParticipation(1L);

        assertThat(result.getCurrentParticipants()).isEqualTo(0);
    }
}
