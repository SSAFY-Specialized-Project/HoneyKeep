package com.barcode.honeykeep.webauthn.dto;

import com.barcode.honeykeep.webauthn.entity.WebAuthnCredential;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * WebAuthn 인증정보 DTO 클래스
 * 클라이언트에 인증정보 목록을 반환하기 위한 DTO
 */
public record WebAuthnCredentialDTO(
        Long id,
        String credentialId,
        String deviceName,
        String deviceType,
        LocalDateTime registerdAt,
        LocalDateTime lastUsedAt,
        String aaguid,
        List<String> transports,
        String status
) {
    /**
     * WebAuthnCredential 엔티티를 DTO로 변환
     */
    public static WebAuthnCredentialDTO fromEntity(WebAuthnCredential credential) {
        return new WebAuthnCredentialDTO(
                credential.getId(),
                credential.getCredentialId(),
                credential.getDeviceName(),
                credential.getDeviceType(),
                credential.getRegisteredAt(),
                credential.getLastUsedAt(),
                credential.getAaguid(),
                credential.getTransportList(),
                credential.getStatus().name()
        );
    }
} 