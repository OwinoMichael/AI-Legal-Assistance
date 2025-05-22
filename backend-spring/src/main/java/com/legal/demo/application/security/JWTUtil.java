package com.legal.demo.application.security;

import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import java.util.Date;

public class JWTUtil {
    private static final SecretKey KEY = Jwts.SIG.HS512.key().build();
    private static final long EXP_TIME_10_DAYS = 15 * 60 * 1000;

    public static String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .expiration(new Date(System.currentTimeMillis() + EXP_TIME_10_DAYS))
                .signWith(KEY, Jwts.SIG.HS512)
                .compact();
    }

    public static String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public static Boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(KEY)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception ex) {
            System.out.println("Invalid token: " + ex.getMessage());
            return false;
        }
    }
}
