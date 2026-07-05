-- ============================================================
--  Smart Crop Advisor — Database Schema Setup
--  File Location: database/schema.sql
-- ============================================================

-- ── 1. Create Database if not exists ──────────────────────────
-- CREATE DATABASE IF NOT EXISTS smart_crop_advisor;
-- USE smart_crop_advisor;

-- ── 2. Create users Table ─────────────────────────────────────
-- Holds user account details and credentials.
-- Passwords must always be stored as BCrypt hashes.
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 3. Create soil_inputs Table ───────────────────────────────
-- Holds soil nutrient readings submitted by farmers.
-- Linked to the user who submitted them.
CREATE TABLE IF NOT EXISTS soil_inputs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    nitrogen DOUBLE NOT NULL,
    phosphorus DOUBLE NOT NULL,
    potassium DOUBLE NOT NULL,
    temperature DOUBLE NOT NULL,
    humidity DOUBLE NOT NULL,
    ph DOUBLE NOT NULL,
    rainfall DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 4. Create recommendations Table ───────────────────────────
-- Holds predictions returned by the ML models.
-- Linked to the user and (for soil-based reports) the soil input.
CREATE TABLE IF NOT EXISTS recommendations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    soil_input_id BIGINT,
    recommendation_type VARCHAR(20) NOT NULL,
    result TEXT NOT NULL,
    confidence DOUBLE,
    advisory_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (soil_input_id) REFERENCES soil_inputs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 5. Create disease_info Table ───────────────────────────────
-- Stands as a reference/lookup table for plant diseases.
-- Populated with seed data (not written to at runtime).
CREATE TABLE IF NOT EXISTS disease_info (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    crop_name VARCHAR(100) NOT NULL,
    disease_name VARCHAR(150) NOT NULL,
    symptoms TEXT,
    treatment TEXT,
    prevention TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
