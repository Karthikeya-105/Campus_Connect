package com.campusconnect.config;

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
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/students/register").permitAll()
                        .requestMatchers("/api/companies/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobs/active").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobs/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/jobs").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.POST, "/api/applications").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/applications/me").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/applications/job/**").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.PATCH, "/api/applications/**").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.POST, "/api/resume/upload").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.POST, "/api/resume/ats-score/**").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.POST, "/api/resume/ats-score-company/**").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.GET, "/api/resume/view/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/admin/**").hasRole("ADMIN")     // ⬅️ NEW
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}