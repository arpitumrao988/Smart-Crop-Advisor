// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/controller/AuthController.java
//
//  WHAT IS THIS FILE?
//  This controller exposes REST API endpoints for user
//  registration and login under the "/api/v1/auth" namespace.
//  It intercepts requests, invokes validation, and maps results to HTTP responses.
// ============================================================

package com.smartcropadvisor.backend.controller;

import com.smartcropadvisor.backend.dto.ApiResponse;
import com.smartcropadvisor.backend.dto.AuthResponse;
import com.smartcropadvisor.backend.dto.LoginRequest;
import com.smartcropadvisor.backend.dto.RegisterRequest;
import com.smartcropadvisor.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ── POST /api/v1/auth/register ───────────────────────────
    // Receives registration payload, runs validation, and saves user.
    // Handles duplicate email exceptions cleanly.
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.successMessage("User registered successfully. You can now login."));
        } catch (IllegalArgumentException e) {
            // Returns 400 Bad Request if email already exists
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── POST /api/v1/auth/login ──────────────────────────────
    // Validates credentials, executes authentication, and returns JWT token if valid.
    // Handles wrong email/password exceptions cleanly.
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            // Return AuthResponse directly at the root JSON level to match Axios frontend mapping
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            // BadCredentialsException (wrong password) is caught here
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password. Please try again."));
        } catch (IllegalArgumentException e) {
            // User not found in DB is caught here
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
