package com.barcode.honeykeep.webauthn.service;

import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.auth.util.JwtTokenProvider;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.pay.exception.PayErrorCode;
import com.barcode.honeykeep.webauthn.dto.WebAuthnAuthDetails;
import com.barcode.honeykeep.webauthn.dto.WebAuthnTokenInfo;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebAuthnTokenService {

    private final JwtTokenProvider tokenProvider;

    // WebAuthn 인증 완료 후 토큰 생성
    public String generateWebAuthnToken(String userId, WebAuthnAuthDetails authDetails) {
        // 기본 클레임 설정
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("authType", "WEBAUTHN");
        claims.put("authLevel", authDetails.getAuthLevel()); // STRONG or NORMAL
        claims.put("authenticatorId", authDetails.getAuthenticatorId());
        claims.put("authTime", Instant.now().getEpochSecond());

        // 토큰 생성 (기존 tokenProvider 활용)
        return tokenProvider.generateTokenWithClaims(claims);
    }

    // 토큰에서 WebAuthn 정보 추출
    public WebAuthnTokenInfo parseWebAuthnToken(String token) {
        // 토큰 유효성 검증
        if (!tokenProvider.validateToken(token)) {
            throw new CustomException(AuthErrorCode.JWT_TOKEN_EXPIRED);
        }

        // 클레임 추출
        Claims claims = tokenProvider.getAllClaimsFromToken(token);
        String userId = claims.get("userId", String.class);
        String authType = claims.get("authType", String.class);
        String authLevel = claims.get("authLevel", String.class);
        String authenticatorId = claims.get("authenticatorId", String.class);
        Long authTime = claims.get("authTime", Long.class);

        // WebAuthn 정보가 아니면 예외 처리
        if (!"WEBAUTHN".equals(authType)) {
            throw new CustomException(AuthErrorCode.INVALID_AUTH_TYPE);
        }

        return new WebAuthnTokenInfo(userId, authLevel, authenticatorId, authTime);
    }

    // 강력 인증 여부 확인 (결제 등 민감 작업에 필요)
    public boolean hasStrongAuth(String token) {
        WebAuthnTokenInfo info = parseWebAuthnToken(token);
        return "STRONG".equals(info.getAuthLevel());
    }

    // 최근 인증 여부 확인 (5분 이내)
    public boolean hasRecentAuth(String token) {
        WebAuthnTokenInfo info = parseWebAuthnToken(token);
        long currentTime = Instant.now().getEpochSecond();
        return (currentTime - info.getAuthTime()) < 300; // 5분(300초) 이내
    }
    
    /**
     * PayController 등에서 사용할 수 있는 통합 검증 메서드
     * 토큰이 유효한지, 강력 인증인지, 최근 인증인지, 해당 사용자의 것인지 한 번에 검증
     *
     * @param token 검증할 토큰
     * @param expectedUserId 예상되는 사용자 ID (일치해야 함)
     * @return 검증 결과 (항상 true 반환, 실패 시 예외 발생)
     * @throws CustomException 검증 실패 시 적절한 에러 코드와 함께 예외 발생
     */
    public boolean validateAuthToken(String token, String expectedUserId) {
        try {
            // 1. 토큰 자체 유효성 검증 (만료, 서명 등)
            if (!tokenProvider.validateToken(token)) {
                log.error("토큰이 유효하지 않습니다");
                throw new CustomException(AuthErrorCode.JWT_TOKEN_EXPIRED);
            }
            
            // 2. WebAuthn 토큰 파싱 및 기본 검증 (타입 등)
            WebAuthnTokenInfo info = parseWebAuthnToken(token);
            
            // 3. 사용자 ID 일치 여부 확인
            if (!info.getUserId().equals(expectedUserId)) {
                log.error("토큰 사용자 ID({})와 요청 사용자 ID({})가 일치하지 않습니다", info.getUserId(), expectedUserId);
                throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS);
            }
            
            // 4. 강력 인증 여부 확인
            if (!"STRONG".equals(info.getAuthLevel())) {
                log.error("강력 인증이 필요합니다. 현재 인증 레벨: {}", info.getAuthLevel());
                throw new CustomException(AuthErrorCode.STRONG_AUTH_REQUIRED);
            }
            
            // 5. 최근 인증 여부 확인 (3분 이내)
            long currentTime = Instant.now().getEpochSecond();
            if ((currentTime - info.getAuthTime()) >= 180) { // 3분 초과
                log.error("최근 인증이 필요합니다. 인증 시간: {}, 현재 시간: {}", 
                        info.getAuthTime(), currentTime);
                throw new CustomException(AuthErrorCode.RECENT_AUTH_REQUIRED);
            }
            
            return true; // 모든 검증 통과
        } catch (CustomException e) {
            // 이미 적절한 에러 코드와 함께 생성된 예외는 그대로 전파
            throw e;
        } catch (Exception e) {
            // 기타 예외는 일반 인증 실패로 처리
            log.error("토큰 검증 중 오류 발생: {}", e.getMessage(), e);
            throw new CustomException(AuthErrorCode.PAYMENT_AUTH_FAILED);
        }
    }
}