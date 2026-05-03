package org.example.contentservice.services.implementing;

import org.example.contentservice.entities.Assessment;
import org.example.contentservice.entities.Certification;
import org.example.contentservice.entities.Content;
import org.example.contentservice.repositories.AssessmentRepository;
import org.example.contentservice.repositories.CertificationRepository;
import org.example.contentservice.repositories.ContentRepository;
import org.example.contentservice.services.interfaces.ICertificationService;
import org.example.contentservice.services.interfaces.IEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CertificationServiceImpl implements ICertificationService {

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private IEmailService emailService;

    @Value("${matchy.backend.url:http://localhost:9090/api}")
    private String matchyBackendUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private void hydrateUserInfo(Certification cert) {
        if (cert.getUserId() == null) return;
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> user = restTemplate.getForObject(
                    matchyBackendUrl + "/users/" + cert.getUserId(), Map.class);
            if (user != null) {
                Object name = user.get("name");
                Object email = user.get("email");
                if (name != null) cert.setUserName(name.toString());
                if (email != null) cert.setUserEmail(email.toString());
            }
        } catch (Exception e) {
            System.err.println("Failed to load user " + cert.getUserId() + " from matchy backend: " + e.getMessage());
        }
    }

    private void syncTransients(Certification cert) {
        if (cert.getContent() != null) cert.setContentId(cert.getContent().getContentId());
        if (cert.getAssessment() != null) cert.setAssessmentId(cert.getAssessment().getAssessmentId());
        hydrateUserInfo(cert);
    }

    @Override
    public List<Certification> retrieveAllCertifications() {
        List<Certification> certifications = certificationRepository.findAll();
        for (Certification cert : certifications) {
            syncTransients(cert);
        }
        return certifications;
    }

    @Override
    public Certification addCertification(Certification certification) {
        certification.setIssuedAt(LocalDateTime.now());

        if (certification.getContentId() != null) {
            Optional<Content> contentOpt = contentRepository.findById(certification.getContentId());
            contentOpt.ifPresent(certification::setContent);
        }

        if (certification.getAssessmentId() != null) {
            Optional<Assessment> assessmentOpt = assessmentRepository.findById(certification.getAssessmentId());
            assessmentOpt.ifPresent(certification::setAssessment);
        }

        Certification saved = certificationRepository.save(certification);
        syncTransients(saved);

        if (saved.getUserEmail() != null && !saved.getUserEmail().isEmpty()) {
            emailService.sendCertificationEmail(saved, saved.getUserEmail());
        }

        return saved;
    }

    @Override
    public Certification updateCertification(Certification certification) {
        if (certification.getContentId() != null) {
            Optional<Content> contentOpt = contentRepository.findById(certification.getContentId());
            contentOpt.ifPresent(certification::setContent);
        }

        if (certification.getAssessmentId() != null) {
            Optional<Assessment> assessmentOpt = assessmentRepository.findById(certification.getAssessmentId());
            assessmentOpt.ifPresent(certification::setAssessment);
        }

        Certification saved = certificationRepository.save(certification);
        syncTransients(saved);
        return saved;
    }

    @Override
    public Certification retrieveCertification(Integer certificationId) {
        Optional<Certification> certOpt = certificationRepository.findById(certificationId);
        if (certOpt.isPresent()) {
            Certification cert = certOpt.get();
            syncTransients(cert);
            return cert;
        }
        return null;
    }

    @Override
    public void deleteCertification(Integer certificationId) {
        certificationRepository.deleteById(certificationId);
    }
}