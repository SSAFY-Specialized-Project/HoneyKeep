package com.barcode.honeykeep.webauthn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * WebAuthn 등록 요청 DTO
 * 클라이언트로부터 받은 등록 시작 요청 정보
 */
public record RegistrationRequest(
        Long userId,
        String displayName,
        String authenticatorAttachment,
        String userVerification
) {
} 