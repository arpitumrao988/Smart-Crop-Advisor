// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/dto/UserProfileResponse.java
//
//  WHAT IS THIS FILE?
//  DTO carrying user profile details returned to the frontend.
//  It excludes sensitive credential fields (password hash).
// ============================================================

package com.smartcropadvisor.backend.dto;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Long id,
        String name,
        String email,
        String location,
        LocalDateTime createdAt
) {}
