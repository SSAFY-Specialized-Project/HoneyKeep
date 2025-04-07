export interface RequestCredentialsRequest {
    "X-Signature": string;
    "X-Timestamp": string;

    [key: string]: string;
}

export interface RegisterCertificateRequest {
    publicKey: string,
}

export interface RegisterCertificateResponse {
    id: number,
    serialNumber: string,
    expiryDate: Date,
    status: string,
}

export interface WebAuthnAuthenticationFinishRequest {
    sessionId: string;
    credential: {
        id: string;
        type: string;
        rawId: string;
        response: {
            clientDataJSON: string;
            authenticatorData: string;
            signature: string;
            userHandle: string | null; // userHandle은 null일 수 있음
        };
        clientExtensionResults: Record<string, any>;
    };
}

export interface WebAuthnRegistrationCompleteRequest {
    sessionId: string;
    credential: {
        id: string;
        type: string;
        rawId: string;
        response: {
            clientDataJSON: string;
            attestationObject: string;
        };
        clientExtensionResults: Record<string, any>;
    };
    deviceName?: string;
}

export interface WebAuthnRegistrationCompleteResponse {
    success: boolean;
    message: string | null;
    data: {
        credentialId?: string;
    };
}

export interface WebAuthnAuthenticationFinishResponse {
    success: boolean;
    message: string | null;
    data?: any; // 성공 시 응답 데이터 (필요에 따라 구체화)
}

export interface WebAuthnCredential {
    id: number;
    credentialId: string;
    deviceName: string;
    deviceType: string;
    registerdAt: string;
    lastUsedAt: string;
    aaguid: string;
    transports: string[];
    status: string;
}

export interface WebAuthnCredentialsResponse {
    status: number;
    message: string;
    data: WebAuthnCredential[];
    timestamp: string;
}

export interface RequestCredentialsResponse {
    token: string;
}

export interface WebAuthnAuthenticationStartRequest {
}

export interface WebAuthnAuthenticationStartResponse {
    success: boolean;
    message: string | null;
    data: {
        challenge: string;
        allowCredentials?: Array<{
            type: string;
            id: string;
            transports?: string[];
        }>;
        timeout?: number;
        rpId?: string;
        userVerification?: string;
    };
    sessionId: string;
}

export interface WebAuthnRegistrationStartRequest {
    displayName?: string;
    authenticatorAttachment: string;
    userVerification: string;
}

export interface WebAuthnRegistrationStartResponse {
    success: boolean;
    message: string | null;
    data: {
        attestation: string;
        challenge: string;
        authenticatorSelection: {
            userVerification: string;
            residentKey: string;
        };
        user: {
            id: string;
            displayName: string;
            name: string;
        };
        rp: {
            name: string;
            id: string;
        };
        timeout: number;
    };
    sessionId: string;
}

export interface Certificate {
    id: string;
    name: string;
    provider: string;
    logo: string;
}

export interface AccountVerification {
    accountNumber: string;
    bankCode: string;
}

export interface PinVerification {
    accountNumber: string;
    pin: string;
}

export interface Bank {
    code: string;
    name: string;
    icon?: string;
}

