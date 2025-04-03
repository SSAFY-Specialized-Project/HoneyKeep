package com.barcode.honeykeep.webauthn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationFinishResponse {
    private boolean success;
    private String credentialId;
    private String userHandle;
} 