// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/dto/ApiResponse.java
//

//  Uses plain constructor + static factory methods instead.
//  Works 100% without any annotation processing.
// ============================================================

package com.smartcropadvisor.backend.dto;

// No Lombok needed here — we write the constructor manually.
// This avoids the "Cannot resolve method 'builder'" IntelliJ error
// which happens when Lombok annotation processing is delayed.

public class ApiResponse<T> {

    // ── Fields ────────────────────────────────────────────────
    private boolean success;  // true = OK, false = error
    private String message;   // human-readable result message
    private T data;           // actual payload, null on error

    // ── Constructor (used by static factory methods below) ───
    // Private so no one creates ApiResponse directly with 'new'.
    // Always use: ApiResponse.success(...) or ApiResponse.error(...)
    private ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // ── Getters ───────────────────────────────────────────────
    // Written manually — no Lombok needed.
    // Jackson uses these to serialize the object to JSON.
    public boolean isSuccess() { return success; }
    public String getMessage()  { return message; }
    public T getData()          { return data; }

    // ================================================================
    //  STATIC FACTORY METHODS
    //  Clean way to create responses in controllers:
    //
    //  return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    //  return ResponseEntity.badRequest().body(ApiResponse.error("Wrong password"));
    // ================================================================

    // ── success() ────────────────────────────────────────────
    // Request succeeded AND there is data to return.
    // Example: login → returns token + user info
    // Example: crop recommendation → returns prediction result
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    // ── successMessage() ─────────────────────────────────────
    // Request succeeded but NO data to return.
    // Example: user deleted their account
    // Example: password changed successfully
    public static <T> ApiResponse<T> successMessage(String message) {
        return new ApiResponse<>(true, message, null);
    }

    // ── error() ──────────────────────────────────────────────
    // Request failed — returns error message, data is null.
    // Example: wrong password, email already exists, user not found
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}