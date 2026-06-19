// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/controller/UserController.java
//
//  WHAT IS THIS FILE?
//  This controller exposes REST API endpoints for user profile
//  lookup, profile updates, and account deletion under "/api/v1/users".
//  These endpoints are protected and require a valid JWT token.
// ============================================================

package com.smartcropadvisor.backend.controller;

import com.smartcropadvisor.backend.dto.ApiResponse;
import com.smartcropadvisor.backend.dto.UserProfileResponse;
import com.smartcropadvisor.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ── GET /api/v1/users/{id} ───────────────────────────────
    // Retrieves details for a specific user profile
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long id) {
        try {
            UserProfileResponse response = userService.getUserProfile(id);
            // Return UserProfileResponse directly at the root JSON level to match Axios frontend parsing
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ── PUT /api/v1/users/{id} ───────────────────────────────
    // Updates name and location parameters of the user profile
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateUserProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        try {
            String name = payload.get("name");
            String location = payload.get("location");

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Name cannot be empty."));
            }

            userService.updateUserProfile(id, name.trim(), location != null ? location.trim() : "");
            return ResponseEntity.ok(ApiResponse.successMessage("Profile updated successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── DELETE /api/v1/users/{id} ────────────────────────────
    // Deletes the user account and cascading relational records
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable Long id) {
        try {
            userService.deleteAccount(id);
            return ResponseEntity.ok(ApiResponse.successMessage("Account deleted successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
