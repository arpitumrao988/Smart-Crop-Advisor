package com.smartcropadvisor.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "soil_inputs")
public class SoilInput {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Double nitrogen;

    @Column(nullable = false)
    private Double phosphorus;

    @Column(nullable = false)
    private Double potassium;

    @Column(nullable = false)
    private Double temperature;

    @Column(nullable = false)
    private Double humidity;

    @Column(name = "ph", nullable = false)
    private Double ph;

    @Column(nullable = false)
    private Double rainfall;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ── Constructors ─────────────────────────────────────────
    public SoilInput() {}

    public SoilInput(Long id, User user, Double nitrogen, Double phosphorus, Double potassium,
                     Double temperature, Double humidity, Double ph, Double rainfall, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.nitrogen = nitrogen;
        this.phosphorus = phosphorus;
        this.potassium = potassium;
        this.temperature = temperature;
        this.humidity = humidity;
        this.ph = ph;
        this.rainfall = rainfall;
        this.createdAt = createdAt;
    }

    // ── Builder Pattern ──────────────────────────────────────
    public static SoilInputBuilder builder() {
        return new SoilInputBuilder();
    }

    public static class SoilInputBuilder {
        private Long id;
        private User user;
        private Double nitrogen;
        private Double phosphorus;
        private Double potassium;
        private Double temperature;
        private Double humidity;
        private Double ph;
        private Double rainfall;
        private LocalDateTime createdAt;

        public SoilInputBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SoilInputBuilder user(User user) {
            this.user = user;
            return this;
        }

        public SoilInputBuilder nitrogen(Double nitrogen) {
            this.nitrogen = nitrogen;
            return this;
        }

        public SoilInputBuilder phosphorus(Double phosphorus) {
            this.phosphorus = phosphorus;
            return this;
        }

        public SoilInputBuilder potassium(Double potassium) {
            this.potassium = potassium;
            return this;
        }

        public SoilInputBuilder temperature(Double temperature) {
            this.temperature = temperature;
            return this;
        }

        public SoilInputBuilder humidity(Double humidity) {
            this.humidity = humidity;
            return this;
        }

        public SoilInputBuilder ph(Double ph) {
            this.ph = ph;
            return this;
        }

        public SoilInputBuilder rainfall(Double rainfall) {
            this.rainfall = rainfall;
            return this;
        }

        public SoilInputBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public SoilInput build() {
            return new SoilInput(id, user, nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall, createdAt);
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

    public Double getNitrogen() {
        return nitrogen;
    }

    public void setNitrogen(Double nitrogen) {
        this.nitrogen = nitrogen;
    }

    public Double getPhosphorus() {
        return phosphorus;
    }

    public void setPhosphorus(Double phosphorus) {
        this.phosphorus = phosphorus;
    }

    public Double getPotassium() {
        return potassium;
    }

    public void setPotassium(Double potassium) {
        this.potassium = potassium;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Double getPh() {
        return ph;
    }

    public void setPh(Double ph) {
        this.ph = ph;
    }

    public Double getRainfall() {
        return rainfall;
    }

    public void setRainfall(Double rainfall) {
        this.rainfall = rainfall;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}