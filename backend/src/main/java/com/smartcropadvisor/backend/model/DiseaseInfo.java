package com.smartcropadvisor.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "disease_info")
public class DiseaseInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "crop_name", nullable = false, length = 100)
    private String cropName;

    @Column(name = "disease_name", nullable = false, length = 150)
    private String diseaseName;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(columnDefinition = "TEXT")
    private String treatment;

    @Column(columnDefinition = "TEXT")
    private String prevention;

    // ── Constructors ─────────────────────────────────────────
    public DiseaseInfo() {}

    public DiseaseInfo(Long id, String cropName, String diseaseName, String symptoms, String treatment, String prevention) {
        this.id = id;
        this.cropName = cropName;
        this.diseaseName = diseaseName;
        this.symptoms = symptoms;
        this.treatment = treatment;
        this.prevention = prevention;
    }

    // ── Builder Pattern ──────────────────────────────────────
    public static DiseaseInfoBuilder builder() {
        return new DiseaseInfoBuilder();
    }

    public static class DiseaseInfoBuilder {
        private Long id;
        private String cropName;
        private String diseaseName;
        private String symptoms;
        private String treatment;
        private String prevention;

        public DiseaseInfoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public DiseaseInfoBuilder cropName(String cropName) {
            this.cropName = cropName;
            return this;
        }

        public DiseaseInfoBuilder diseaseName(String diseaseName) {
            this.diseaseName = diseaseName;
            return this;
        }

        public DiseaseInfoBuilder symptoms(String symptoms) {
            this.symptoms = symptoms;
            return this;
        }

        public DiseaseInfoBuilder treatment(String treatment) {
            this.treatment = treatment;
            return this;
        }

        public DiseaseInfoBuilder prevention(String prevention) {
            this.prevention = prevention;
            return this;
        }

        public DiseaseInfo build() {
            return new DiseaseInfo(id, cropName, diseaseName, symptoms, treatment, prevention);
        }
    }

    // ── Getters and Setters ─────────────────────────────────
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getDiseaseName() {
        return diseaseName;
    }

    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public String getPrevention() {
        return prevention;
    }

    public void setPrevention(String prevention) {
        this.prevention = prevention;
    }
}