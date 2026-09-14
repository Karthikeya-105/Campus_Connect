package com.campusconnect.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JWTUtil {
    private static  final String SECRET="campusConnectSuperSecretKeyForJwtSigning2026ChangeMePlease1234";
    private static final long EXPIRATION_MS=1000 * 60 * 60 * 24; // 24 hours
    private final Key signingKey= Keys.hmacShaKeyFor(SECRET.getBytes());


    //Concept: This is a helper class. It has two jobs:
    //Generate a token from a student's email.
    //Extract the email from a token (when verifying).
    public String generateToken(String email){
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+EXPIRATION_MS))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }
    // 2️⃣ Extract the email (subject) from a token
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    public boolean isTokenValid(String token, String email) {
        try {
            String extracted = extractEmail(token);
            return extracted.equals(email) && !isExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isExpired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }
}
