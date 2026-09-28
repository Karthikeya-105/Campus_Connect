package com.campusconnect.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF (unnecessary for stateless REST APIs)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configure(http))

                // 2. Do not create HTTP sessions — JWT is stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 3. Tell Spring what to do when an unauthenticated request hits a protected endpoint
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"Unauthorized. Please log in.\"}");
                        })
                )

                // 4. Which endpoints are public vs protected
                .authorizeHttpRequests(auth -> auth
                        // Auth endpoints — public
                        .requestMatchers("/api/auth/**").permitAll()

                        // Registration endpoints — public
                        .requestMatchers("/api/students/register").permitAll()
                        .requestMatchers("/api/companies/register").permitAll()

                        // Job browsing — public
                        .requestMatchers(HttpMethod.GET, "/api/jobs/active").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobs/{id}").permitAll()

                        // Job creation — companies only
                        .requestMatchers(HttpMethod.POST, "/api/jobs").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.POST, "/api/applications").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/applications/me").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/applications/job/**").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.PATCH, "/api/applications/**").hasRole("COMPANY")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )
                // 5. Register our JWT filter BEFORE Spring's default filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}