package com.barcode.honeykeep.auth.util;

import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expireSec}")
    private int jwtExpireSec;

    @PostConstruct
    protected void init() {
        jwtSecret = Base64.getEncoder().encodeToString(jwtSecret.getBytes());
    }

    private final RedisTemplate<String, String> redisTemplate;

    public JwtTokenProvider(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // 토큰 생성
    public String generateToken(Long userId) {
        long now = System.currentTimeMillis();
        Date issuedAt = new Date(now);
        Date expiration = new Date(now + jwtExpireSec * 1000L); // 2시간 (밀리초 단위)

        return Jwts.builder()
                .claim("userId", userId)
                .setIssuedAt(issuedAt)          // 토큰 발행 시간
                .setExpiration(expiration)      // 만료 시간
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    // 토큰에서 인증 정보 조회
    public Authentication getAuthentication(String token) {
        Long userId = getUserId(token);
        return new UsernamePasswordAuthenticationToken(userId, null, null);
    }

    // 요청에서 토큰 추출
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {

            // redis의 blacklist (logout 요청한 jwt token) 중 토큰이 포함되었는지 확인
            String blacklistKey = "jwt:blacklist:" + token;
            if(redisTemplate.hasKey(blacklistKey)) {
                return false;
            }

            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(jwtSecret)
                    .build()
                    .parseClaimsJws(token);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 토큰에서 userId 조회
    public Long getUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("userId", Long.class);
    }

    // 만료된 토큰에서 userId 조회
    public Long getUserIdFromExpiredToken(String token) {
        try {
            // 아직 안 만료된 토큰이면 그냥 클레임 파싱
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtSecret)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.get("userId", Long.class);

        } catch (ExpiredJwtException e) {
            // 만료된 토큰이어도 e.getClaims()로 클레임에 접근 가능
            Claims claims = e.getClaims();
            return claims.get("userId", Long.class);
        }
    }
}
