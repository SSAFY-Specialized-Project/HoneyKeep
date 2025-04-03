package com.barcode.honeykeep.webauthn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WebAuthnTokenInfo {
    private String userId;
    private String authLevel;
    private String authenticatorId;
    private Long authTime;
} 