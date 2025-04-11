import {useState} from "react";
import {
    WebAuthnAuthenticationFinishRequest,
    WebAuthnAuthenticationFinishResponse
} from "@/entities/certification/model/types.ts";
import {
    finishWebAuthnAuthenticationAPI,
    startWebAuthnAuthenticationAPI
} from "@/entities/certification/api";
import {ResponseDTO} from "@/shared/model/types.ts";

type UseWebAuthnAuthenticationReturn = {
    isLoading: boolean;
    error: Error | null;
    startAuthentication: () => Promise<ResponseDTO<WebAuthnAuthenticationFinishResponse> | null>;
}

/**
 * WebAuthn 인증 과정을 처리하는 커스텀 훅
 *
 * WebAuthn 인증 과정:
 * 1. 서버에 인증 시작 요청
 * 2. 서버가 challenge와 옵션을 생성해서 클라이언트에 반환
 * 3. 브라우저의 WebAuthn API (navigator.credentials.get)를 호출하여 인증기(생체인식/PIN)와 통신
 * 4. 인증기가 사용자를 검증하고 challenge에 서명
 * 5. 서명된 데이터와 기타 정보를 서버로 전송하여 인증 완료
 */
export const useWebAuthnAuthentication = (): UseWebAuthnAuthenticationReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * ArrayBuffer를 Base64Url 문자열로 변환
     * (표준 Base64와 달리 '+'를 '-'로, '/'를 '_'로 대체하고 패딩 제거)
     */
    const bufferToBase64Url = (buffer: ArrayBuffer): string => {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const base64 = window.btoa(binary);
        // Base64를 Base64Url로 변환 (URL 안전한 문자로 대체)
        return base64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, ''); // 끝의 패딩 문자 제거
    };

    /**
     * URL-safe base64 문자열을 ArrayBuffer로 변환
     * - 와 _ 문자를 + 와 / 로 변환하여 표준 base64로 만듦
     */
    const base64ToBuffer = (base64: string): ArrayBuffer => {
        // URL-safe base64를 표준 base64로 변환
        const standardBase64 = base64
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        // 패딩 처리 (4의 배수 길이로 맞추기)
        const paddedBase64 = standardBase64.padEnd(
            standardBase64.length + (4 - (standardBase64.length % 4 || 4)) % 4,
            '='
        );

        try {
            const binaryString = window.atob(paddedBase64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        } catch (err) {
            console.error('Base64 디코딩 오류:', err, '원본 문자열:', base64);
            throw err;
        }
    };

    /**
     * WebAuthn 인증 시작
     * @returns Promise<FinishAuthResponse | null> 인증 완료 응답 또는 에러 발생 시 null
     */
    const startAuthentication = async (): Promise<ResponseDTO<WebAuthnAuthenticationFinishResponse> | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. 서버에 인증 시작 요청
            const response = await startWebAuthnAuthenticationAPI();

            if (!response.data) {
                throw new Error("인증 시작에 실패했습니다.");
            }

            console.log("인증 시작 서버 응답 데이터:", response);
            // 2. 서버로부터 받은 challenge와 옵션
            // sessionId 저장 (인증 완료 시 필요)

            const responseData = response.data;
            const sessionId = responseData.sessionId;
            if (!sessionId) {
                throw new Error("세션 ID가 없습니다. 인증을 진행할 수 없습니다.");
            }
            console.log("세션 ID:", sessionId);

            // 서버로부터 받은 WebAuthn 옵션
            const webAuthnData = responseData.data;
            if (!webAuthnData || !webAuthnData.challenge) {
                throw new Error("WebAuthn challenge 데이터가 없습니다.");
            }

            // 3. Base64 형식의 challenge와 allowCredentials ID를 ArrayBuffer로 변환
            const challenge = base64ToBuffer(webAuthnData.challenge);
            const allowCredentials = webAuthnData.allowCredentials?.map(cred => ({
                type: cred.type as PublicKeyCredentialType,
                id: base64ToBuffer(cred.id),
                transports: cred.transports as AuthenticatorTransport[] | undefined,
            }));

            // 4. PublicKeyCredentialRequestOptions 생성
            const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
                challenge,
                timeout: webAuthnData.timeout,
                rpId: webAuthnData.rpId,
                allowCredentials,
                userVerification: webAuthnData.userVerification as UserVerificationRequirement,
            };

            // 5. 브라우저의 WebAuthn API (navigator.credentials.get) 호출
            // 이 단계에서 사용자는 생체인식/PIN 등으로 인증
            const credential = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions,
            }) as PublicKeyCredential;

            console.log("생성된 인증정보 (get):", credential);

            // 6. 응답 데이터 변환
            const assertionResponse = credential.response as AuthenticatorAssertionResponse;
            console.log("단언 응답:", assertionResponse);

            // userHandle 처리 (null일 수 있음)
            const userHandle = assertionResponse.userHandle ? bufferToBase64Url(assertionResponse.userHandle) : null;

            // 7. 서버에 전송할 인증 완료 요청 데이터 구성
            const authenticationFinishRequest: WebAuthnAuthenticationFinishRequest = {
                sessionId,
                credential: {
                    id: credential.id,
                    type: credential.type,
                    rawId: bufferToBase64Url(credential.rawId),
                    response: {
                        clientDataJSON: bufferToBase64Url(assertionResponse.clientDataJSON),
                        authenticatorData: bufferToBase64Url(assertionResponse.authenticatorData),
                        signature: bufferToBase64Url(assertionResponse.signature),
                        userHandle: userHandle,
                    },
                    clientExtensionResults: (credential.getClientExtensionResults() || {}) as Record<string, AuthenticationExtensionsClientOutputs>,
                },
            };

            console.log("인증 완료 요청:", authenticationFinishRequest);

            // 8. 서버에 인증 완료 요청 전송
            const finishResponse = await finishWebAuthnAuthenticationAPI(authenticationFinishRequest);
            console.log("마지막요청: ", finishResponse);
            if (!finishResponse.data || !finishResponse.data.success) {
                throw new Error(finishResponse.data?.message || "인증 완료에 실패했습니다.");
            }

            return finishResponse;

        } catch (err) {
            console.error("WebAuthn 인증 오류:", err);
            setError(err instanceof Error ? err : new Error("알 수 없는 인증 오류가 발생했습니다."));
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        startAuthentication,
    };
};

export default useWebAuthnAuthentication; 