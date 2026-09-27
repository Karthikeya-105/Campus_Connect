package com.campusconnect.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JWTUtil {

    // 🔐 Secret key — must be at least 32 characters for HS256
    private static final String SECRET =
            "campusConnectSuperSecretKeyForJwtSigning2026ChangeMePlease1234";

    private static final long EXPIRATION_MS = 1000 * 60 * 60 * 24; // 24 hours

    private final Key signingKey = Keys.hmacShaKeyFor(SECRET.getBytes());

    // 1. Generate a JWT with email as subject and role as a custom claim
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)                        // ⬅️ role goes in payload
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // 2. Extract the email (subject)
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // 3. Extract the role custom claim
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // 4. Is the token valid for this email?
    public boolean isTokenValid(String token, String email) {
        try {
            String extractedEmail = extractEmail(token);
            return extractedEmail.equals(email) && !isExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // ─────────── Private helpers ───────────
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }
}