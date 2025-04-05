import { customFetchAPI } from "@/shared/api";

// 서버 API 요청 형식
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

// 서버 API 응답 형식
export interface WebAuthnAuthenticationFinishResponse {
  success: boolean;
  message: string | null;
  data?: any; // 성공 시 응답 데이터 (필요에 따라 구체화)
}

/**
 * WebAuthn 인증 완료 API
 * 브라우저로부터 받은 인증 데이터를 서버로 전송하여 검증합니다.
 */
const finishWebAuthnAuthenticationAPI = (data: WebAuthnAuthenticationFinishRequest) =>
  customFetchAPI<WebAuthnAuthenticationFinishResponse, WebAuthnAuthenticationFinishRequest>({
    url: "/webauthn/authenticate/finish",
    method: "POST",
    credentials: "include",
    data,
  });

export default finishWebAuthnAuthenticationAPI; 