// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/repository/UserRepository.java
//
//  WHAT IS THIS FILE?
//  This is a Spring Data JPA Repository interface.
//  It gives us ALL database operations for the 'users' table
//  WITHOUT writing a single line of SQL.
//
//  HOW DOES IT WORK?
//  We extend JpaRepository<User, Long>:
//    → User = which entity/table this repository is for
//    → Long = the data type of the primary key (id column is Long/BIGINT)
//
//  By extending JpaRepository, Spring automatically gives us:
//    save(user)          → INSERT or UPDATE a user row
//    findById(id)        → SELECT * FROM users WHERE id = ?
//    findAll()           → SELECT * FROM users
//    deleteById(id)      → DELETE FROM users WHERE id = ?
//    existsById(id)      → SELECT COUNT(*) FROM users WHERE id = ?
//    count()             → SELECT COUNT(*) FROM users
//  ...and many more — all for free, zero SQL written by us.
//
//  We only define CUSTOM methods below for queries JpaRepository
//  doesn't provide out of the box (like finding by email).
//
//  WHO USES THIS?
//  AuthService.java — to find user by email during login
//  AuthService.java — to check if email exists during registration
//  UserService.java — to get/update/delete user profile
// ============================================================

package com.smartcropadvisor.backend.repository;

// Import our User entity — this repository manages User objects
import com.smartcropadvisor.backend.model.User;

// JpaRepository provides all standard CRUD + pagination methods
import org.springframework.data.jpa.repository.JpaRepository;

// @Repository marks this as a Spring-managed bean (optional here
// because JpaRepository is already detected by Spring, but good practice)
import org.springframework.stereotype.Repository;

// Optional wraps a value that might be null — safer than returning null directly.
// If user is not found, we return Optional.empty() instead of null.
// This forces the calling code (AuthService) to handle the "not found" case
// explicitly, preventing NullPointerExceptions.
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // ── We extend JpaRepository<User, Long> ──────────────────
    // First type param  = User   → which entity this manages
    // Second type param = Long   → type of the primary key field (id)

    // ================================================================
    //  CUSTOM QUERY METHODS
    //
    //  Spring Data JPA reads the METHOD NAME and automatically generates
    //  the SQL query. This is called "Query Derivation from Method Names".
    //
    //  Rules:
    //  findBy<FieldName>   → SELECT * FROM users WHERE field_name = ?
    //  existsBy<FieldName> → SELECT COUNT(*) > 0 FROM users WHERE field_name = ?
    //  deleteBy<FieldName> → DELETE FROM users WHERE field_name = ?
    //
    //  The field name must EXACTLY match a field in the User entity class.
    //  'email' here → matches 'private String email' in User.java
    // ================================================================

    // ── findByEmail ──────────────────────────────────────────
    // Auto-generated SQL: SELECT * FROM users WHERE email = ?
    //
    // Returns Optional<User> because the email might not exist in the DB.
    // Optional forces AuthService to handle both cases:
    //   → user found:     optional.get() or optional.orElseThrow()
    //   → user not found: optional.isEmpty() → return "Invalid credentials"
    //
    // USED IN: AuthService.login() — find the user by their email address
    //          to verify their password and generate a JWT token.
    Optional<User> findByEmail(String email);

    // ── existsByEmail ─────────────────────────────────────────
    // Auto-generated SQL: SELECT COUNT(*) > 0 FROM users WHERE email = ?
    // Returns true if a user with this email already exists, false otherwise.
    //
    // USED IN: AuthService.register() — before creating a new user, we check
    //          if the email is already taken. If true → return error response
    //          "Email already registered" without trying to insert a duplicate.
    //
    // Why not just use findByEmail and check if it's present?
    // existsByEmail is more efficient — it only checks existence (COUNT query),
    // it doesn't load the entire User object from the database.
    boolean existsByEmail(String email);
}