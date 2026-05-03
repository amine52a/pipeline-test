package com.matchy.service.impl;

import com.matchy.dto.RegistrationCreateDTO;
import com.matchy.dto.RegistrationDTO;
import com.matchy.entity.Evenement;
import com.matchy.entity.Registration;
import com.matchy.entity.RegistrationStatus;
import com.matchy.exception.ResourceNotFoundException;
import com.matchy.repository.EvenementRepository;
import com.matchy.repository.RegistrationRepository;
import com.matchy.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EvenementRepository evenementRepository;

    @Override
    @Transactional
    public RegistrationDTO createRegistration(RegistrationCreateDTO createDTO) {
        if (createDTO.getUserId() == null) {
            throw new IllegalArgumentException("userId is required");
        }

        Evenement evenement = evenementRepository.findById(createDTO.getEvenementId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + createDTO.getEvenementId()));

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
}