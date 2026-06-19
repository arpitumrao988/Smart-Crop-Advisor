package com.smartcropadvisor.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "soil_input_id", nullable = true)
    private SoilInput soilInput;

    @Enumerated(EnumType.STRING)
    @Column(name = "recommendation_type", nullable = false, length = 20)
    private RecommendationType recommendationType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String result;

    @Column
    private Double confidence;

    @Column(name = "advisory_note", columnDefinition = "TEXT")
    private String advisoryNote;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ── Constructors ─────────────────────────────────────────
    public Recommendation() {}

    public Recommendation(Long id, User user, SoilInput soilInput, RecommendationType recommendationType,
                          String result, Double confidence, String advisoryNote, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.soilInput = soilInput;
        this.recommendationType = recommendationType;
        this.result = result;
        this.confidence = confidence;
        this.advisoryNote = advisoryNote;
        this.createdAt = createdAt;
    }

    // ── Builder Pattern ──────────────────────────────────────
    public static RecommendationBuilder builder() {
        return new RecommendationBuilder();
    }

    public static class RecommendationBuilder {
        private Long id;
        private User user;
        private SoilInput soilInput;
        private RecommendationType recommendationType;
        private String result;
        private Double confidence;
        private String advisoryNote;
        private LocalDateTime createdAt;

        public RecommendationBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public RecommendationBuilder user(User user) {
            this.user = user;
            return this;
        }

        public RecommendationBuilder soilInput(SoilInput soilInput) {
            this.soilInput = soilInput;
            return this;
        }

        public RecommendationBuilder recommendationType(RecommendationType recommendationType) {
            this.recommendationType = recommendationType;
            return this;
        }

        public RecommendationBuilder result(String result) {
            this.result = result;
            return this;
        }

        public RecommendationBuilder confidence(Double confidence) {
            this.confidence = confidence;
            return this;
        }

        public RecommendationBuilder advisoryNote(String advisoryNote) {
            this.advisoryNote = advisoryNote;
            return this;
        }

        public RecommendationBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Recommendation build() {
            return new Recommendation(id, user, soilInput, recommendationType, result, confidence, advisoryNote, createdAt);
        }
    }

    // ── Getters and Setters ─────────────────────────────────
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SoilInput getSoilInput() {
        return soilInput;
    }

    public void setSoilInput(SoilInput soilInput) {
        this.soilInput = soilInput;
    }

    public RecommendationType getRecommendationType() {
        return recommendationType;
    }

    public void setRecommendationType(RecommendationType recommendationType) {
        this.recommendationType = recommendationType;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getAdvisoryNote() {
        return advisoryNote;
    }

    public void setAdvisoryNote(String advisoryNote) {
        this.advisoryNote = advisoryNote;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public enum RecommendationType {
        CROP,
        FERTILIZER,
        IRRIGATION,
        DISEASE
    }
}