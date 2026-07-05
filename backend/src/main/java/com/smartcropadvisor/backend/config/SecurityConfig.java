// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/config/SecurityConfig.java
//
//  WHAT IS THIS FILE?
//  This is the configuration class for Spring Security.
//  It binds together JWT filtration, stateless session policies,
//  CORS permissions, password hashing, and route protection rules.
// ============================================================

package com.smartcropadvisor.backend.config;

import com.smartcropadvisor.backend.repository.UserRepository;
import com.smartcropadvisor.backend.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(UserDetailsService userDetailsService, JwtAuthFilter jwtAuthFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Value("${cors.allowed-origin}")
    private String allowedOrigin;

    // ── AuthenticationProvider ───────────────────────────────────
    // DaoAuthenticationProvider loads UserDetails and compares passwords using BCrypt.
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // ── PasswordEncoder ──────────────────────────────────────────
    // Uses BCrypt to securely hash user passwords.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ── AuthenticationManager ────────────────────────────────────
    // Exposes the AuthenticationManager bean for AuthService.java to perform authentication.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ── CorsConfigurationSource ──────────────────────────────────
    // Custom CORS rules allowing the React frontend (running on port 3000) to fetch APIs.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigin));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ── SecurityFilterChain ──────────────────────────────────────
    // Core filter chain settings. Sets stateless session policy and protects endpoints.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configure CORS using our custom source
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Disable CSRF since we use stateless JWT authentication (not session cookies)
                .csrf(csrf -> csrf.disable())
                
                // Authorize endpoints
                .authorizeHttpRequests(auth -> auth
                        // Permit public auth requests, health check, and error fallback paths
                        .requestMatchers("/api/v1/auth/**", "/api/v1/health", "/error").permitAll()
                        // Require authentication for any other API endpoints
                        .anyRequest().authenticated()
                )
                
                // Session policy is stateless (no HttpSession will be created/used)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                
                // Set our authentication provider
                .authenticationProvider(authenticationProvider())
                
                // Inject JWT authorization filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
