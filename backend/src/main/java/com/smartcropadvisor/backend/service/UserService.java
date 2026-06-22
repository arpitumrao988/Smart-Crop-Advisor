// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/service/UserService.java
//
//  WHAT IS THIS FILE?
//  This service class contains business logic for user profile
//  lookup, profile updates, and account deletion.
// ============================================================

package com.smartcropadvisor.backend.service;

import com.smartcropadvisor.backend.dto.UserProfileResponse;
import com.smartcropadvisor.backend.model.User;
import com.smartcropadvisor.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ── getUserProfile() ─────────────────────────────────────
    // Fetches the user profile by ID and wraps it into UserProfileResponse
    public UserProfileResponse getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getLocation(),
                user.getCreatedAt()
        );
    }

    // ── updateUserProfile() ──────────────────────────────────
    // Updates name and location fields on the user account
    @Transactional
    public void updateUserProfile(Long id, String name, String location) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

        user.setName(name);
        user.setLocation(location);
        userRepository.save(user);
    }

    // ── deleteAccount() ──────────────────────────────────────
    // Deletes the user account by ID. Relational records (soil_inputs,
    // recommendations) are cascade-deleted at the DB level (foreign key).
    @Transactional
    public void deleteAccount(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }
}
