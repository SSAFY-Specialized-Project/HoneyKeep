package com.barcode.honeykeep.webauthn.dto;

/**
 * WebAuthn 인증 요청 DTO
 * 클라이언트로부터 받은 인증 시작 요청 정보
 */
public record AuthenticationRequest(
        Long userId,
        String userVerification
) {
} 