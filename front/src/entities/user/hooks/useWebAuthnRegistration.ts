import { useState } from "react";
import { startWebAuthnRegistrationAPI, completeWebAuthnRegistrationAPI } from "../api";
import { WebAuthnRegistrationCompleteRequest } from "../../certification/api/finishWebAuthnRegistrationAPI.ts";
import { WebAuthnRegistrationStartResponse } from "../../certification/api/startWebAuthnRegistrationAPI.ts";

type UseWebAuthnRegistrationReturn = {
  isLoading: boolean;
  error: Error | null;
  startRegistration: (displayName: string, deviceName?: string) => Promise<void>;
}

/**
 * WebAuthn 등록 과정을 처리하는 커스텀 훅
 * 
 * WebAuthn 등록 과정:
 * 1. 서버에 등록 시작 요청
 * 2. 서버가 challenge와 옵션을 생성해서 클라이언트에 반환
 * 3. 브라우저의 WebAuthn API를 호출하여 인증기(생체인식/PIN)와 통신
 * 4. 인증기가 키 쌍(공개키/개인키)을 생성 - 개인키는 인증기에 안전하게 저장
 * 5. 생성된 공개키와 기타 정보를 서버로 전송하여 등록 완료
 */
export const useWebAuthnRegistration = (): UseWebAuthnRegistrationReturn => {
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
   * WebAuthn 등록 시작
   */
  const startRegistration = async (displayName?: string, deviceName?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. 서버에 등록 시작 요청
      const response = await startWebAuthnRegistrationAPI();
      
      if (!response.data) {
        throw new Error("등록 시작에 실패했습니다.");
      }
      
      // 2. 서버로부터 받은 데이터
      const responseData = response.data as WebAuthnRegistrationStartResponse;
      console.log("서버 응답 데이터:", responseData);

      // sessionId 저장 (등록 완료 시 필요)
      const sessionId = response.sessionId;
      
      if (!sessionId) {
        throw new Error("세션 ID가 없습니다. 등록을 진행할 수 없습니다.");
      }
      
      console.log("세션 ID:", sessionId);

      // 서버로부터 받은 WebAuthn 옵션
      const webAuthnData = responseData;
      if (!webAuthnData) {
        throw new Error("WebAuthn 데이터가 없습니다.");
      }

      // 3. Base64 형식의 challenge와 userId를 ArrayBuffer로 변환
      const challenge = base64ToBuffer(webAuthnData.challenge);
      const userId = base64ToBuffer(webAuthnData.user.id);
      console.log("Challenge:", webAuthnData.challenge);
      console.log("UserId:", webAuthnData.user.id);

      // 4. PublicKeyCredentialCreationOptions 생성
      // 알고리즘 파라미터 기본값 설정 (서버에서 제공하지 않을 경우)
      const pubKeyCredParams = [
        { type: "public-key" as const, alg: -7 }, // ES256
        { type: "public-key" as const, alg: -257 } // RS256
      ];
      
      // 5. 브라우저의 WebAuthn API 호출
      // 이 단계에서 브라우저와 인증기(생체인식/PIN)가 통신하여 키 쌍(공개키/개인키)을 생성
      // 개인키는 인증기에 안전하게 저장되고, 공개키는 서버로 전송됨
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: webAuthnData.rp,
          user: {
            id: userId,
            name: webAuthnData.user.name,
            displayName: webAuthnData.user.displayName
          },
          pubKeyCredParams,
          timeout: webAuthnData.timeout,
          authenticatorSelection: {
            // 서버에서 받은 authenticatorSelection 값을 사용
            authenticatorAttachment: "platform" as AuthenticatorAttachment,
            requireResidentKey: webAuthnData.authenticatorSelection.residentKey === "required",
            residentKey: webAuthnData.authenticatorSelection.residentKey as ResidentKeyRequirement,
            userVerification: webAuthnData.authenticatorSelection.userVerification as UserVerificationRequirement
          },
          attestation: webAuthnData.attestation as AttestationConveyancePreference,
        },
      }) as PublicKeyCredential;
      
      console.log("생성된 인증정보:", credential);

      // 6. 응답 데이터 변환
      const attestationResponse = credential.response as AuthenticatorAttestationResponse;
      console.log("증명 응답:", attestationResponse);

      // 7. 서버에 전송할 요청 데이터 구성 (최대한 단순화)
      const registrationCompleteRequest: WebAuthnRegistrationCompleteRequest = {
        sessionId,
        credential: {
          id: credential.id,
          type: credential.type,
          rawId: bufferToBase64Url(credential.rawId),
          response: {
            clientDataJSON: bufferToBase64Url(attestationResponse.clientDataJSON),
            attestationObject: bufferToBase64Url(attestationResponse.attestationObject),
          },
          // clientExtensionResults는 null이 아닌 빈 객체로 전송
          clientExtensionResults: credential.getClientExtensionResults() || {},
        },
        deviceName: deviceName || `${displayName}의 기기`
      };
      
      console.log("등록 완료 요청:", registrationCompleteRequest);

      // 8. 서버에 등록 완료 요청 전송
      const completeResponse = await completeWebAuthnRegistrationAPI(registrationCompleteRequest);
      
      if (!completeResponse.success) {
        throw new Error(completeResponse.data.message || "등록 완료에 실패했습니다.");
      }else{
        console.log("등록 완료: ", completeResponse);
      }
      
    } catch (err) {
      console.error("WebAuthn 등록 오류:", err);
      setError(err instanceof Error ? err : new Error("알 수 없는 오류가 발생했습니다."));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    startRegistration,
  };
};

export default useWebAuthnRegistration; 