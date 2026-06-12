// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/dto/LoginRequest.java
//
//  WHAT THIS DTO IS FOR:
//  POST /api/v1/auth/login
//  Frontend sends this JSON body:
//  {
//    "email": "arpit@gmail.com",
//    "password": "mypassword123"
//  }
//
//  AuthService uses this to:
//  1. Find the user by email in DB
//  2. Compare the submitted password with the BCrypt hash stored in DB
//  3. If match → generate and return a JWT token
//  4. If no match → return 401 Unauthorized
// ============================================================

package com.smartcropadvisor.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        // ── email ─────────────────────────────────────────────
        // Must be non-empty and valid email format.
        // AuthService calls userRepository.findByEmail(email)
        // to look up the user.
        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email address")
        String email,

        // ── password ──────────────────────────────────────────
        // Must be non-empty.
        // AuthService passes this to BCryptPasswordEncoder.matches()
        // to verify against the stored hash — never compared as plain text.
        @NotBlank(message = "Password is required")
        String password

) {}