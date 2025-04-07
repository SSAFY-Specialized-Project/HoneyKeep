import { customFetchAPI } from "@/shared/api";
import {
  WebAuthnAuthenticationFinishRequest,
  WebAuthnAuthenticationFinishResponse
} from "@/entities/certification/model/types.ts";

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