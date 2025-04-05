import { customFetchAPI } from "@/shared/api";

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

/**
 * WebAuthn 등록 시작 API
 * 플랫폼 인증기(데스크탑/노트북 내장 인증기)를 사용하여 등록 시작
 */
const startWebAuthnRegistrationAPI = (displayName?: string) =>
  customFetchAPI<WebAuthnRegistrationStartResponse, WebAuthnRegistrationStartRequest>({
    url: "/webauthn/register/start",
    method: "POST",
    data: {
      displayName,
      authenticatorAttachment: "platform", // 플랫폼 인증기 사용 (데스크탑/노트북 내장)
      userVerification: "required" // PIN 입력 필수
    },
  });

export default startWebAuthnRegistrationAPI; 