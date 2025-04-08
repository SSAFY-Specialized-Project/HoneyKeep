import {customFetchAPI} from "@/shared/api";
import {
    WebAuthnRegistrationCompleteRequest,
    WebAuthnRegistrationCompleteResponse
} from "@/entities/certification/model/types.ts";

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