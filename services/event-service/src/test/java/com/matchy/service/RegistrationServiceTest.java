package com.matchy.service;

import com.matchy.dto.RegistrationCreateDTO;
import com.matchy.dto.RegistrationDTO;
import com.matchy.entity.Evenement;
import com.matchy.entity.Registration;
import com.matchy.entity.RegistrationStatus;
import com.matchy.exception.ResourceNotFoundException;
import com.matchy.repository.EvenementRepository;
import com.matchy.repository.RegistrationRepository;
import com.matchy.service.impl.RegistrationServiceImpl;
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
@DisplayName("RegistrationService — Unit Tests")
class RegistrationServiceTest {

    @Mock RegistrationRepository registrationRepository;
    @Mock EvenementRepository evenementRepository;
    @InjectMocks RegistrationServiceImpl registrationService;

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Evenement buildEvenement(Long id, int max, int current) {
        Evenement e = new Evenement();
        e.setId(id);
        e.setTitle("Test Event " + id);
        e.setType(Evenement.EvenementType.CONFERENCE);
        e.setMaxParticipants(max);
        e.setCurrentParticipants(current);
        e.setStatus("ACTIVE");
        e.setDate(LocalDateTime.now().plusDays(7));
        return e;
    }

    private Registration buildRegistration(Long id, Evenement event, RegistrationStatus status) {
        Registration r = new Registration();
        r.setId(id);
        r.setFirstName("John");
        r.setLastName("Doe");
        r.setEmail("john@example.com");
        r.setUserId(1L);
        r.setEvenement(event);
        r.setStatus(status);
        return r;
    }

    private RegistrationCreateDTO buildCreateDTO(Long evenementId) {
        RegistrationCreateDTO dto = new RegistrationCreateDTO();
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setEmail("john@example.com");
        dto.setUserId(1L);
        dto.setEvenementId(evenementId);
        return dto;
    }

    // ── CRUD Tests ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("createRegistration() — creates with PENDING status")
    void createRegistration_createsPending() {
        Evenement event = buildEvenement(1L, 100, 5);
        RegistrationCreateDTO dto = buildCreateDTO(1L);
        Registration saved = buildRegistration(1L, event, RegistrationStatus.PENDING);

        when(evenementRepository.findById(1L)).thenReturn(Optional.of(event));
        when(registrationRepository.countApprovedByEvenementId(1L)).thenReturn(5L);
        when(registrationRepository.save(any())).thenReturn(saved);

        RegistrationDTO result = registrationService.createRegistration(dto);

        assertThat(result.getStatus()).isEqualTo(RegistrationStatus.PENDING);
        assertThat(result.getFirstName()).isEqualTo("John");
        assertThat(result.getEvenementId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("createRegistration() — throws when event not found")
    void createRegistration_throwsWhenEventNotFound() {
        when(evenementRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> registrationService.createRegistration(buildCreateDTO(99L)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("createRegistration() — throws when event is at capacity")
    void createRegistration_throwsWhenAtCapacity() {
        Evenement event = buildEvenement(1L, 10, 10);
        when(evenementRepository.findById(1L)).thenReturn(Optional.of(event));
        when(registrationRepository.countApprovedByEvenementId(1L)).thenReturn(10L);

        assertThatThrownBy(() -> registrationService.createRegistration(buildCreateDTO(1L)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("capacity");
    }

    @Test
    @DisplayName("createRegistration() — throws when userId is null")
    void createRegistration_throwsWhenUserIdNull() {
        RegistrationCreateDTO dto = buildCreateDTO(1L);
        dto.setUserId(null);

        assertThatThrownBy(() -> registrationService.createRegistration(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("userId");
    }

    @Test
    @DisplayName("getRegistrationById() — returns DTO when found")
    void getRegistrationById_returnsDTO() {
        Evenement event = buildEvenement(1L, 100, 1);
        Registration r = buildRegistration(1L, event, RegistrationStatus.PENDING);
        when(registrationRepository.findById(1L)).thenReturn(Optional.of(r));

        RegistrationDTO result = registrationService.getRegistrationById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getEmail()).isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("getRegistrationById() — throws when not found")
    void getRegistrationById_throwsWhenNotFound() {
        when(registrationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> registrationService.getRegistrationById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("getAllRegistrations() — returns all registrations")
    void getAllRegistrations_returnsAll() {
        Evenement event = buildEvenement(1L, 100, 2);
        List<Registration> regs = List.of(
                buildRegistration(1L, event, RegistrationStatus.PENDING),
                buildRegistration(2L, event, RegistrationStatus.APPROVED)
        );
        when(registrationRepository.findAll()).thenReturn(regs);

        List<RegistrationDTO> result = registrationService.getAllRegistrations();

        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("getRegistrationsByEvenementId() — filters by event")
    void getRegistrationsByEvenementId_filtersByEvent() {
        Evenement event = buildEvenement(1L, 100, 2);
        List<Registration> regs = List.of(
                buildRegistration(1L, event, RegistrationStatus.PENDING),
                buildRegistration(2L, event, RegistrationStatus.APPROVED)
        );
        when(registrationRepository.findByEvenementId(1L)).thenReturn(regs);

        List<RegistrationDTO> result = registrationService.getRegistrationsByEvenementId(1L);

        assertThat(result).hasSize(2);
        assertThat(result).allMatch(r -> r.getEvenementId().equals(1L));
    }

    // ── Business Logic Tests ──────────────────────────────────────────────────

    @Test
    @DisplayName("approveRegistration() — sets APPROVED and increments participants")
    void approveRegistration_approvesAndIncrements() {
        Evenement event = buildEvenement(1L, 100, 5);
        Registration r = buildRegistration(1L, event, RegistrationStatus.PENDING);

        when(registrationRepository.findById(1L)).thenReturn(Optional.of(r));
        when(registrationRepository.countApprovedByEvenementId(1L)).thenReturn(5L);
        when(registrationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(evenementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        RegistrationDTO result = registrationService.approveRegistration(1L);

        assertThat(result.getStatus()).isEqualTo(RegistrationStatus.APPROVED);
        assertThat(event.getCurrentParticipants()).isEqualTo(6);
        verify(evenementRepository).save(event);
    }

    @Test
    @DisplayName("approveRegistration() — throws when already approved")
    void approveRegistration_throwsWhenAlreadyApproved() {
        Evenement event = buildEvenement(1L, 100, 5);
        Registration r = buildRegistration(1L, event, RegistrationStatus.APPROVED);
        when(registrationRepository.findById(1L)).thenReturn(Optional.of(r));

        assertThatThrownBy(() -> registrationService.approveRegistration(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already approved");
    }

    @Test
    @DisplayName("approveRegistration() — throws when event at capacity")
    void approveRegistration_throwsWhenEventFull() {
        Evenement event = buildEvenement(1L, 10, 10);
        Registration r = buildRegistration(1L, event, RegistrationStatus.PENDING);

        when(registrationRepository.findById(1L)).thenReturn(Optional.of(r));
        when(registrationRepository.countApprovedByEvenementId(1L)).thenReturn(10L);

        assertThatThrownBy(() -> registrationService.approveRegistration(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("capacity");
    }

    @Test
    @DisplayName("rejectRegistration() — sets REJECTED status")
    void rejectRegistration_setsRejected() {
        Evenement event = buildEvenement(1L, 100, 5);
        Registration r = buildRegistration(1L, event, RegistrationStatus.PENDING);

        when(registrationRepository.findById(1L)).thenReturn(Optional.of(r));
        when(registrationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        RegistrationDTO result = registrationService.rejectRegistration(1L);

        assertThat(result.getStatus()).isEqualTo(RegistrationStatus.REJECTED);
        verify(evenementRepository, never()).save(any()); // no participant change for PENDING→REJECTED
    }

    @Test
    @DisplayName("rejectRegistration() — decrements participants when rejecting APPROVED")
    void rejectRegistration_decrementsWhenRejectingApproved() {
        Evenement event = buildEvenement(1L, 100, 5);
        Registration r = buildRegistration(1L, event, RegistrationStatus.APPROVED);

        when(registrationRepository.findById(1L)).thenReturn(Optional.of(r));
        when(registrationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(evenementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        registrationService.rejectRegistration(1L);

        assertThat(event.getCurrentParticipants()).isEqualTo(4);
        verify(evenementRepository).save(event);
    }

    @Test
    @DisplayName("deleteRegistration() — decrements participants when deleting APPROVED")
    void deleteRegistration_decrementsWhenDeletingApproved() {
        Evenement event = buildEvenement(1L, 100, 3);
        Registration r = buildRegistration(1L, event, RegistrationStatus.APPROVED);

        when(registrationRepository.findById(1L)).thenReturn(Optional.of(r));
        when(evenementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        registrationService.deleteRegistration(1L);

        assertThat(event.getCurrentParticipants()).isEqualTo(2);
        verify(registrationRepository).delete(r);
    }

    @Test
    @DisplayName("deleteRegistration() — does not decrement for PENDING deletion")
    void deleteRegistration_doesNotDecrementForPending() {
        Evenement event = buildEvenement(1L, 100, 3);
        Registration r = buildRegistration(1L, event, RegistrationStatus.PENDING);

        when(registrationRepository.findById(1L)).thenReturn(Optional.of(r));

        registrationService.deleteRegistration(1L);

        assertThat(event.getCurrentParticipants()).isEqualTo(3);
        verify(evenementRepository, never()).save(any());
        verify(registrationRepository).delete(r);
    }

    @Test
    @DisplayName("getApprovedCountByEvenementId() — returns count from repository")
    void getApprovedCount_returnsCount() {
        when(registrationRepository.countApprovedByEvenementId(1L)).thenReturn(7L);

        Long count = registrationService.getApprovedCountByEvenementId(1L);

        assertThat(count).isEqualTo(7L);
    }
}
