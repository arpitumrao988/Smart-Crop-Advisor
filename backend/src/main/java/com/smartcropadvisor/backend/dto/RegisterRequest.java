// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/dto/RegisterRequest.java
//
//  WHAT IS A DTO?
//  DTO = Data Transfer Object.
//  It is a simple object used to carry data BETWEEN layers.
//  In our case: from the HTTP request body → into our Service layer.
//
//  WHY NOT USE THE ENTITY (User.java) DIRECTLY?
//  Because the User entity has fields we don't want the client
//  to send or receive — like 'id', 'createdAt', 'authorities' etc.
//  DTOs give us full control over what comes IN and goes OUT.
//
//  WHY JAVA 21 RECORD?
//  A Record is a special Java class that is:
//    → Immutable (fields cannot be changed after creation)
//    → Auto-generates: constructor, getters, equals(), hashCode(), toString()
//    → Perfect for DTOs — we only READ the incoming data, never modify it
//    → Much cleaner than a regular class with Lombok @Data
//
//  WHAT THIS DTO IS FOR:
//  POST /api/v1/auth/register
//  Frontend sends this JSON body:
//  {
//    "name": "Arpit Umrao",
//    "email": "arpit@gmail.com",
//    "password": "mypassword123",
//    "location": "Lucknow"   ← optional
//  }
//  Spring automatically converts this JSON → RegisterRequest record.
// ============================================================

package com.smartcropadvisor.backend.dto;

// Validation annotations — from spring-boot-starter-validation in pom.xml
// These run BEFORE AuthService is called.
// If any validation fails → Spring returns 400 Bad Request automatically.
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// ── Java 21 Record ───────────────────────────────────────────
// 'record' keyword creates an immutable data class.
// Everything inside () are the fields — Java auto-generates:
//   → A constructor:  new RegisterRequest(name, email, password, location)
//   → Getters:        name(), email(), password(), location()
//     NOTE: Record getters use field name directly (no "get" prefix)
//     So to access name: request.name()  NOT  request.getName()
//   → toString(), equals(), hashCode() — all automatic
public record RegisterRequest(

        // ── name ─────────────────────────────────────────────
        // @NotBlank = cannot be null, empty "", or just spaces "   "
        // message = what gets returned in the 400 error response
        // if the farmer doesn't provide a name
        @NotBlank(message = "Name is required")

        // @Size = controls the length of the string
        // min=2  → name must be at least 2 characters
        // max=100 → name cannot exceed 100 characters (matches DB column length)
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        String name,

        // ── email ─────────────────────────────────────────────
        // @NotBlank = email cannot be empty
        @NotBlank(message = "Email is required")

        // @Email = validates that the string is a valid email format
        // Rejects: "notanemail", "missing@", "@nodomain"
        // Accepts: "arpit@gmail.com", "farmer@yahoo.in"
        @Email(message = "Please provide a valid email address")
        String email,

        // ── password ──────────────────────────────────────────
        // @NotBlank = password cannot be empty
        @NotBlank(message = "Password is required")

        // @Size min=6 → enforce minimum password length
        // We'll BCrypt hash this in AuthService before saving to DB
        // The plain text password never gets stored anywhere
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password,

        // ── location ──────────────────────────────────────────
        // No @NotBlank here — location is OPTIONAL during registration.
        // If the farmer doesn't provide it, this will be null.
        // Null is allowed because User.java has @Column for location without nullable=false.
        String location

) {
    // Records can have custom methods if needed.
    // For RegisterRequest we don't need any — just the fields.
    // AuthService will use: request.name(), request.email(),
    //                       request.password(), request.location()
}