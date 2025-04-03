import { customFetchAPI } from "@/shared/api";

// 인증 시작 요청 (현재는 빈 객체 또는 userId만 서버에서 설정)
export interface WebAuthnAuthenticationStartRequest { }

// 인증 시작 응답 형식 (서버 응답 구조에 따라 추정)
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

/**
 * WebAuthn 인증 시작 API
 * 서버에 인증 시작을 요청하고 challenge와 옵션을 받습니다.
 */
const startWebAuthnAuthenticationAPI = () =>
  customFetchAPI<WebAuthnAuthenticationStartResponse, WebAuthnAuthenticationStartRequest>({
    url: "/webauthn/authenticate/start",
    method: "POST",
    credentials: "include",
    // request body는 필요 없을 수 있음 (서버에서 @AuthenticationPrincipal 사용)
    data: {},
  });

export default startWebAuthnAuthenticationAPI; 