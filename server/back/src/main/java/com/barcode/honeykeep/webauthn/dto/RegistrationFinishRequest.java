package com.barcode.honeykeep.webauthn.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * WebAuthn 등록 완료 요청 DTO
 * 클라이언트로부터 받은 등록 완료 요청 정보
 */
public record RegistrationFinishRequest(
        String sessionId,
        Map<String, Object> credential,
        String deviceName
) {
} 