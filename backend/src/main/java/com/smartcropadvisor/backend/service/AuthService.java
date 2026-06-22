// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/service/AuthService.java
//
//  WHAT IS THIS FILE?
//  This service class handles the business logic for user
//  registration and login, password hashing, and token generation.
// ============================================================

package com.smartcropadvisor.backend.service;

import com.smartcropadvisor.backend.dto.AuthResponse;
import com.smartcropadvisor.backend.dto.LoginRequest;
import com.smartcropadvisor.backend.dto.RegisterRequest;
import com.smartcropadvisor.backend.model.User;
import com.smartcropadvisor.backend.repository.UserRepository;
import com.smartcropadvisor.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    // ── register() ───────────────────────────────────────────
    // Validates that the email is unique, hashes the password, and saves the user
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email address is already registered.");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .location(request.location())
                .build();

        userRepository.save(user);
    }

    // ── login() ──────────────────────────────────────────────
    // Authenticates credentials via AuthenticationManager, then generates a JWT token
    public AuthResponse login(LoginRequest request) {
        // authenticate() automatically calls our custom UserDetailsService (loaded in SecurityConfig)
        // and verifies the raw password against the stored BCrypt hash.
        // If wrong credentials → throws BadCredentialsException
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        // If we reach this line, authentication succeeded. Fetch the user details to build token.
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        String jwtToken = jwtUtil.generateToken(user);

        return new AuthResponse(jwtToken, user.getId(), user.getName(), user.getEmail());
    }
}
