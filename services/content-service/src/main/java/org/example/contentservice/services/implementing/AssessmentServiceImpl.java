package org.example.contentservice.services.implementing;

import org.example.contentservice.entities.Assessment;
import org.example.contentservice.entities.Certification;
import org.example.contentservice.entities.Content;
import org.example.contentservice.repositories.AssessmentRepository;
import org.example.contentservice.repositories.CertificationRepository;
import org.example.contentservice.repositories.ContentRepository;
import org.example.contentservice.services.interfaces.IAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AssessmentServiceImpl implements IAssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private CertificationRepository certificationRepository;

    @Override
    public List<Assessment> retrieveAllAssessments() {
        List<Assessment> assessments = assessmentRepository.findAll();

        // Synchroniser contentId depuis la relation
        for (Assessment a : assessments) {
            if (a.getContent() != null) {
                a.setContentId(a.getContent().getContentId());
            }
        }

        return assessments;
    }

    @Override
    public Assessment addAssessment(Assessment assessment) {
        // Lier avec Content si contentId est fourni
        if (assessment.getContentId() != null) {
            // Reject if this content already has an assessment (UNIQUE constraint).
            assessmentRepository.findByContent_ContentId(assessment.getContentId())
                    .ifPresent(existing -> {
                        throw new IllegalStateException(
                                "Content " + assessment.getContentId()
                                        + " already has an assessment (id=" + existing.getAssessmentId() + ").");
                    });
            Optional<Content> contentOpt = contentRepository.findById(assessment.getContentId());
            contentOpt.ifPresent(assessment::setContent);
        }

        Assessment saved = assessmentRepository.save(assessment);

        // Synchroniser contentId après sauvegarde
        if (saved.getContent() != null) {
            saved.setContentId(saved.getContent().getContentId());
        }

        return saved;
    }

    @Override
    public Assessment updateAssessment(Assessment assessment) {
        // Lier avec Content si contentId est fourni
        if (assessment.getContentId() != null) {
            Optional<Content> contentOpt = contentRepository.findById(assessment.getContentId());
            contentOpt.ifPresent(assessment::setContent);
        }

        Assessment saved = assessmentRepository.save(assessment);

        // Synchroniser contentId après sauvegarde
        if (saved.getContent() != null) {
            saved.setContentId(saved.getContent().getContentId());
        }

        return saved;
    }

    @Override
    public Assessment retrieveAssessment(Integer assessmentId) {
        Optional<Assessment> assessmentOpt = assessmentRepository.findById(assessmentId);

        if (assessmentOpt.isPresent()) {
            Assessment assessment = assessmentOpt.get();
            if (assessment.getContent() != null) {
                assessment.setContentId(assessment.getContent().getContentId());
            }
            return assessment;
        }

        return null;
    }

    @Override
    @Transactional
    public void deleteAssessment(Integer assessmentId) {
        Optional<Assessment> opt = assessmentRepository.findById(assessmentId);
        if (opt.isEmpty()) {
            return;
        }
        Assessment assessment = opt.get();

        // 1) Detach any certifications that reference this assessment to satisfy the FK.
        List<Certification> certs = certificationRepository.findAll();
        for (Certification c : certs) {
            if (c.getAssessment() != null
                    && assessmentId.equals(c.getAssessment().getAssessmentId())) {
                c.setAssessment(null);
                certificationRepository.save(c);
            }
        }

        // 2) Detach the inverse Content.assessment side so Hibernate doesn't
        //    re-cascade and silently cancel the removal.
        Content content = assessment.getContent();
        if (content != null) {
            content.setAssessment(null);
            assessment.setContent(null);
            contentRepository.save(content);
        }

        // 3) Now actually delete the assessment row.
        assessmentRepository.delete(assessment);
        assessmentRepository.flush();
    }

    @Override
    public Assessment getAssessmentByContentId(Integer contentId) {
        Optional<Assessment> assessmentOpt = assessmentRepository.findByContent_ContentId(contentId);

        if (assessmentOpt.isPresent()) {
            Assessment assessment = assessmentOpt.get();
            assessment.setContentId(contentId);
            return assessment;
        }

        return null;
    }
}