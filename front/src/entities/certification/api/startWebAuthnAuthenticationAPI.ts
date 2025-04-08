import { customFetchAPI } from "@/shared/api";
import {
    WebAuthnAuthenticationStartRequest,
    WebAuthnAuthenticationStartResponse
} from "@/entities/certification/model/types.ts";

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