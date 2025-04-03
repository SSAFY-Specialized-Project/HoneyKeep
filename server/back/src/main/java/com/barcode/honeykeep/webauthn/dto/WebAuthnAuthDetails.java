package com.barcode.honeykeep.webauthn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WebAuthnAuthDetails {
    private String authLevel; // STRONG or NORMAL
    private String authenticatorId;
} 