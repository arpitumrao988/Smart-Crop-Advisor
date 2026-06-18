// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/model/User.java
//
//  WHAT IS THIS FILE?
//  This is a JPA Entity class. It represents the 'users' table
//  in your MySQL database. Every field in this class = one column
//  in the table. Hibernate reads this class and automatically
//  creates/updates the 'users' table when the app starts.
//
//  WHAT IS AN ENTITY?
//  An Entity is just a Java class that is MAPPED to a database table.
//  When you save a User object → a new row gets inserted in 'users' table.
//  When you fetch by ID → Hibernate runs SELECT * FROM users WHERE id = ?
//  All of this happens automatically — you never write raw SQL here.
// ============================================================

package com.smartcropadvisor.backend.model;

// ── JPA / Persistence imports ────────────────────────────────
// These annotations come from Jakarta EE (the new name for Java EE)
// Spring Boot 3.x uses Jakarta, not javax (that's Spring Boot 2.x)
import jakarta.persistence.*;

// ── Lombok imports ───────────────────────────────────────────
// Lombok generates boilerplate code at compile time
// @Data, @Builder, @NoArgsConstructor, @AllArgsConstructor
// are processed by Lombok BEFORE the Java compiler runs
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// ── Java Date/Time ───────────────────────────────────────────
import java.time.LocalDateTime;

// ── Spring Security ──────────────────────────────────────────
// UserDetails is a Spring Security interface.
// By implementing it here, Spring Security can directly use
// our User object for authentication — no separate adapter class needed.
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


// ── @Data (Lombok) ───────────────────────────────────────────
// Automatically generates at compile time:
//   → getters for all fields (getId(), getName(), getEmail(), etc.)
//   → setters for all fields (setId(), setName(), etc.)
//   → toString() method
//   → equals() and hashCode() methods
// Without this annotation, you'd need to write 50+ lines of boilerplate.
@Data

// ── @Builder (Lombok) ────────────────────────────────────────
// Generates a Builder pattern for creating User objects.
// Instead of: User u = new User(); u.setName("Arpit"); u.setEmail("...");
// You can write: User u = User.builder().name("Arpit").email("...").build();
// This is much cleaner and prevents mistakes from wrong argument order.
@Builder

// ── @NoArgsConstructor (Lombok) ──────────────────────────────
// Generates: public User() {}
// JPA/Hibernate REQUIRES a no-argument constructor on every entity.
// Without this, Hibernate cannot create User objects when it reads
// rows from the database → you'll get errors at startup.
@NoArgsConstructor

// ── @AllArgsConstructor (Lombok) ─────────────────────────────
// Generates a constructor with ALL fields as parameters.
// Required by @Builder to work correctly alongside @NoArgsConstructor.
@AllArgsConstructor

// ── @Entity ──────────────────────────────────────────────────
// Marks this class as a JPA entity — tells Hibernate:
// "This Java class maps to a table in the database."
// Without @Entity, Hibernate completely ignores this class.
@Entity

// ── @Table ───────────────────────────────────────────────────
// Specifies WHICH table this entity maps to.
// name = "users" → this class maps to the 'users' table in MySQL.
// Without @Table, Hibernate defaults to the class name (User → "user" table).
// We specify it explicitly to be clear and avoid naming confusion.
@Table(name = "users")
public class User implements UserDetails {
    // We implement UserDetails so Spring Security can use this class directly.
    // UserDetails is the interface Spring Security uses internally to represent
    // an authenticated user. By implementing it here we avoid writing a
    // separate UserDetailsService adapter class.

    // ── PRIMARY KEY ──────────────────────────────────────────
    // @Id → this field is the PRIMARY KEY of the 'users' table
    // @GeneratedValue → MySQL auto-increments this value on each INSERT
    //   strategy = GenerationType.IDENTITY → uses MySQL's AUTO_INCREMENT
    //   This means you NEVER set the id manually — MySQL assigns it automatically.
    //   When you call userRepository.save(user), MySQL sets id = 1, 2, 3, etc.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Maps to: `id` BIGINT PRIMARY KEY AUTO_INCREMENT in MySQL

    // ── NAME COLUMN ──────────────────────────────────────────
    // @Column customizes the column definition.
    //   nullable = false → adds NOT NULL constraint in MySQL
    //   length = 100     → VARCHAR(100) in MySQL
    // Without @Column, Hibernate defaults to: nullable=true, length=255
    @Column(nullable = false, length = 100)
    private String name;
    // Maps to: `name` VARCHAR(100) NOT NULL

    // ── EMAIL COLUMN ─────────────────────────────────────────
    // unique = true → adds a UNIQUE constraint in MySQL
    //   This means no two users can have the same email address.
    //   If you try to save a duplicate email → MySQL throws a constraint violation
    //   → Spring throws DataIntegrityViolationException
    //   → AuthService catches this and returns "Email already exists" response
    @Column(nullable = false, unique = true, length = 150)
    private String email;
    // Maps to: `email` VARCHAR(150) NOT NULL UNIQUE

    // ── PASSWORD COLUMN ──────────────────────────────────────
    // length = 255 because BCrypt hashed passwords are always 60 characters,
    // but we give extra space as a safety buffer.
    // IMPORTANT: We NEVER store the plain text password here.
    // AuthService hashes the password with BCrypt BEFORE saving:
    //   user.setPassword(passwordEncoder.encode(rawPassword));
    // What gets stored: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
    @Column(nullable = false, length = 255)
    private String password;
    // Maps to: `password` VARCHAR(255) NOT NULL

    // ── LOCATION COLUMN ──────────────────────────────────────
    // nullable = true (default) because location is optional.
    // A farmer might not provide their location during registration.
    @Column(length = 100)
    private String location;
    // Maps to: `location` VARCHAR(100)

    // ── CREATED_AT COLUMN ────────────────────────────────────
    // Records when this user account was created.
    // @Column(updatable = false) → once set, this value NEVER changes.
    //   Hibernate will not include this column in UPDATE SQL statements.
    //   If you don't set updatable=false, Hibernate might accidentally
    //   overwrite the original creation time when you update other fields.
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    // Maps to: `created_at` DATETIME

    // ── @PrePersist ──────────────────────────────────────────
    // This method runs AUTOMATICALLY just before a new User is saved to DB.
    // "Pre-Persist" = before the INSERT SQL runs.
    // We use it to set createdAt automatically — no need to set it manually
    // in AuthService. Just call userRepository.save(user) and the timestamp
    // is handled here without any extra code in the service layer.
    @PrePersist
    protected void onCreate() {
        // LocalDateTime.now() = current date and time when the row is inserted
        this.createdAt = LocalDateTime.now();
    }

    // ================================================================
    //  SPRING SECURITY — UserDetails interface implementation
    //
    //  Spring Security requires these methods to work with our User class.
    //  We implement them here so User can be used directly as a
    //  security principal (authenticated identity).
    // ================================================================

    // ── getAuthorities() ─────────────────────────────────────
    // Returns the ROLES/PERMISSIONS this user has.
    // In our project, all users are "ROLE_USER" — regular farmers.
    // Spring Security uses this to decide what actions a user can perform.
    // If we had admin users in future, we'd return "ROLE_ADMIN" here.
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // SimpleGrantedAuthority wraps a string role name
        // "ROLE_USER" is the standard convention for Spring Security roles
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    // ── getUsername() ────────────────────────────────────────
    // Spring Security identifies users by "username".
    // In our app, we use EMAIL as the username (not an actual username field).
    // When Spring Security asks "who is this user?", we return their email.
    // This email is what gets stored in the JWT token as the subject.
    @Override
    public String getUsername() {
        return this.email; // email acts as the unique username
    }

    // ── getPassword() ────────────────────────────────────────
    // Spring Security needs to access the stored (hashed) password
    // during login to compare it with the submitted password using BCrypt.
    // Lombok's @Data already generated getPassword(), but we explicitly
    // declare this here for clarity since UserDetails requires it.
    @Override
    public String getPassword() {
        return this.password;
    }

    // ── Account status methods ───────────────────────────────
    // These methods tell Spring Security if the account is usable.
    // We return true for all of them — in a real production app,
    // you might have features like:
    //   - account locking after 5 failed login attempts
    //   - account expiry (subscription-based apps)
    //   - email verification (isEnabled = false until email verified)
    // For now, all accounts are always active and enabled.

    @Override
    public boolean isAccountNonExpired() {
        return true; // account never expires
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // account is never locked (no lockout feature yet)
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // password never expires
    }

    @Override
    public boolean isEnabled() {
        return true; // account is always active (no email verification yet)
    }
}