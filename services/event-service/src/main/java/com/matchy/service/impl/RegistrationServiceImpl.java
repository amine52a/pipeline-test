package com.matchy.service.impl;

import com.matchy.client.SubscriptionFeignClient;
import com.matchy.dto.RegistrationCreateDTO;
import com.matchy.dto.RegistrationDTO;
import com.matchy.dto.SubscriptionStatusDTO;
import com.matchy.entity.Evenement;
import com.matchy.entity.Registration;
import com.matchy.entity.RegistrationStatus;
import com.matchy.exception.ResourceNotFoundException;
import com.matchy.repository.EvenementRepository;
import com.matchy.repository.RegistrationRepository;
import com.matchy.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EvenementRepository evenementRepository;
    private final SubscriptionFeignClient subscriptionFeignClient;

    @Override
    @Transactional
    public RegistrationDTO createRegistration(RegistrationCreateDTO createDTO) {
        if (createDTO.getUserId() == null) {
            throw new IllegalArgumentException("userId is required");
        }

        Evenement evenement = evenementRepository.findById(createDTO.getEvenementId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + createDTO.getEvenementId()));

        // For CERTIFICATION and TRAINING events, require an active paid subscription
        if (evenement.getType() == Evenement.EvenementType.CERTIFICATION
                || evenement.getType() == Evenement.EvenementType.TRAINING) {
            verifyActiveSubscription(createDTO.getUserId(), evenement.getType().name());
        }

        if (evenement.getMaxParticipants() != null) {
            Long approvedCount = registrationRepository.countApprovedByEvenementId(evenement.getId());
            if (approvedCount >= evenement.getMaxParticipants()) {
                throw new IllegalStateException("Event has reached maximum capacity");
            }
        }

        Registration registration = new Registration();
        registration.setFirstName(createDTO.getFirstName());
        registration.setLastName(createDTO.getLastName());
        registration.setEmail(createDTO.getEmail());
        registration.setUserId(createDTO.getUserId());
        registration.setEvenement(evenement);
        registration.setStatus(RegistrationStatus.PENDING);

        return convertToDTO(registrationRepository.save(registration));
    }

    @Override
    public RegistrationDTO getRegistrationById(Long id) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));
        return convertToDTO(registration);
    }

    @Override
    public List<RegistrationDTO> getAllRegistrations() {
        return registrationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegistrationDTO> getRegistrationsByEvenementId(Long evenementId) {
        return registrationRepository.findByEvenementId(evenementId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegistrationDTO> getRegistrationsByUserId(Long userId) {
        return registrationRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegistrationDTO> getRegistrationsByStatus(RegistrationStatus status) {
        return registrationRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RegistrationDTO approveRegistration(Long id) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));

        if (registration.getStatus() == RegistrationStatus.APPROVED) {
            throw new IllegalStateException("Registration is already approved");
        }

        Evenement evenement = registration.getEvenement();
        if (evenement.getMaxParticipants() != null) {
            Long approvedCount = registrationRepository.countApprovedByEvenementId(evenement.getId());
            if (approvedCount >= evenement.getMaxParticipants()) {
                throw new IllegalStateException("Event has reached maximum capacity");
            }
        }

        registration.setStatus(RegistrationStatus.APPROVED);
        evenement.setCurrentParticipants(evenement.getCurrentParticipants() + 1);
        evenementRepository.save(evenement);

        return convertToDTO(registrationRepository.save(registration));
    }

    @Override
    @Transactional
    public RegistrationDTO rejectRegistration(Long id) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));

        if (registration.getStatus() == RegistrationStatus.APPROVED) {
            Evenement evenement = registration.getEvenement();
            evenement.setCurrentParticipants(Math.max(0, evenement.getCurrentParticipants() - 1));
            evenementRepository.save(evenement);
        }

        registration.setStatus(RegistrationStatus.REJECTED);
        return convertToDTO(registrationRepository.save(registration));
    }

    @Override
    @Transactional
    public void deleteRegistration(Long id) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));

        if (registration.getStatus() == RegistrationStatus.APPROVED) {
            Evenement evenement = registration.getEvenement();
            evenement.setCurrentParticipants(Math.max(0, evenement.getCurrentParticipants() - 1));
            evenementRepository.save(evenement);
        }

        registrationRepository.delete(registration);
    }

    @Override
    public Long getApprovedCountByEvenementId(Long evenementId) {
        return registrationRepository.countApprovedByEvenementId(evenementId);
    }

    private RegistrationDTO convertToDTO(Registration registration) {
        RegistrationDTO dto = new RegistrationDTO();
        dto.setId(registration.getId());
        dto.setFirstName(registration.getFirstName());
        dto.setLastName(registration.getLastName());
        dto.setEmail(registration.getEmail());
        dto.setUserId(registration.getUserId());
        dto.setEvenementId(registration.getEvenement().getId());
        dto.setEvenementTitle(registration.getEvenement().getTitle());
        dto.setStatus(registration.getStatus());
        dto.setCreatedAt(registration.getCreatedAt());
        dto.setUpdatedAt(registration.getUpdatedAt());
        return dto;
    }

    /**
     * Verifies via OpenFeign that the user has an active paid subscription.
     * If subscription-service is unreachable, the check is skipped (fail-open)
     * to avoid blocking registrations due to infrastructure issues.
     */
    private void verifyActiveSubscription(Long userId, String eventType) {
        try {
            List<SubscriptionStatusDTO> subscriptions = subscriptionFeignClient.getSubscriptionsByUser(userId);
            boolean hasActiveSubscription = subscriptions.stream()
                    .anyMatch(s -> s.isAccessGranted() && s.isPaidPlan());
            if (!hasActiveSubscription) {
                throw new IllegalStateException(
                        "An active PRO or PREMIUM subscription is required to register for " + eventType + " events.");
            }
            log.info("Subscription check passed for user {} on event type {}", userId, eventType);
        } catch (IllegalStateException e) {
            throw e; // re-throw business rule violations
        } catch (Exception e) {
            // Feign call failed (service down, timeout, etc.) — log and allow registration
            log.warn("Subscription check skipped for user {} (subscription-service unreachable): {}", userId, e.getMessage());
        }
    }
}