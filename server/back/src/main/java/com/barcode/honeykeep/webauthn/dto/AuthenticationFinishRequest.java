package com.barcode.honeykeep.webauthn.dto;

import java.util.Map;

/**
 * WebAuthn 인증 완료 요청 DTO
 * 클라이언트로부터 받은 인증 완료 요청 정보
 */
public record AuthenticationFinishRequest(
        String sessionId,
        Map<String, Object> credential
) {
} 