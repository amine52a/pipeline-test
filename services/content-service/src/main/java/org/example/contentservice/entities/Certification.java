package org.example.contentservice.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString(exclude = {"content", "assessment"})
@AllArgsConstructor
@NoArgsConstructor
public class Certification implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer certificationId;

    private Float score;

    private LocalDateTime issuedAt;

    private String validity;

    private String verifiedBy;

    @Column(name = "user_id")
    private Integer userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"assessment", "hibernateLazyInitializer", "handler"})
    private Content content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"content", "hibernateLazyInitializer", "handler"})
    private Assessment assessment;

    @Transient
    private Integer contentId;

    @Transient
    private Integer assessmentId;

    @Transient
    private String userName;

    @Transient
    private String userEmail;

    @PrePersist
    protected void onCreate() {
        if (issuedAt == null) {
            issuedAt = LocalDateTime.now();
        }
    }
}