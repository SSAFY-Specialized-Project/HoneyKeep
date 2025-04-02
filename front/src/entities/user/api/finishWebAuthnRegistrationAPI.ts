import { customFetchAPI } from "@/shared/api";

// 서버 API 요청 형식 - 타입 정의를 간소화
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

/**
 * WebAuthn 등록 완료 API
 * 브라우저로부터 받은 인증 응답을 서버로 전송하여 등록 완료
 * 
 * 서버 측 라이브러리(Yubico)에서 발생하는 CBOR 파싱 오류를 방지하기 위해
 * 단순화된 JSON 구조를 사용합니다.
 */
const finishWebAuthnRegistrationAPI = (data: WebAuthnRegistrationCompleteRequest) =>
  customFetchAPI<WebAuthnRegistrationCompleteResponse, WebAuthnRegistrationCompleteRequest>({
    url: "/webauthn/register/finish",
    method: "POST",
    data,
  });

export default finishWebAuthnRegistrationAPI;