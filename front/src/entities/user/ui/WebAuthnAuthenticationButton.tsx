import React from 'react';
import { useWebAuthnAuthentication } from '../hooks';

/**
 * WebAuthn 인증 버튼 컴포넌트의 속성 타입 정의
 * 
 * @property className - 버튼에 적용할 추가 CSS 클래스명
 * @property onSuccess - 인증 성공 시 호출될 콜백 함수
 * @property onError - 인증 실패 시 호출될 콜백 함수, 오류 객체를 매개변수로 받음
 */
interface WebAuthnAuthenticationButtonProps {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * WebAuthn 인증 버튼 컴포넌트
 * 
 * WebAuthn 표준을 사용하여 사용자 디바이스의 생체인식/PIN 등을 통한
 * 암호 없는(passwordless) 로그인을 구현합니다. 이 과정에서 다음과 같은 작업이 수행됩니다:
 * 
 * 1. 서버에 인증 시작 요청을 보내고 challenge를 받습니다.
 * 2. 브라우저의 WebAuthn API를 통해 사용자 인증기(생체/PIN)와 통신합니다.
 * 3. 인증기는 개인키를 사용하여 challenge에 서명합니다.
 * 4. 서명된 데이터를 서버로 전송하여 검증합니다.
 * 5. 서버는 등록 시 저장한 공개키로 서명을 검증하고 인증을 완료합니다.
 * 
 * 이 방식의 주요 장점:
 * - 패스워드 없이 강력한 인증 가능
 * - 피싱 공격에 저항력 있음 (origin이 검증됨)
 * - 생체인식/PIN 등으로 편리한 사용자 경험 제공
 * - 개인키는 안전한 하드웨어에 저장되어 추출 불가능
 */
const WebAuthnAuthenticationButton: React.FC<WebAuthnAuthenticationButtonProps> = ({
  className = '',
  onSuccess,
  onError,
}) => {
  // WebAuthn 인증 로직을 처리하는 커스텀 훅 사용
  const { isLoading, error, startAuthentication } = useWebAuthnAuthentication();

  // 오류 발생 시 onError 콜백 호출
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  /**
   * 버튼 클릭 핸들러
   * 
   * 1. WebAuthn 인증 프로세스 시작
   * 2. 성공 시 onSuccess 콜백 호출
   * 3. 실패 시 콘솔에 오류 기록 (onError 콜백은 useEffect에서 처리)
   * 
   * 사용자 인증기(생체인식/PIN)와의 상호작용은 브라우저 내장 UI를 통해 자동으로 처리됩니다.
   */
  const handleClick = async () => {
    try {
      await startAuthentication();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('WebAuthn 인증 실패:', err);
      // 에러는 useEffect에서 처리
    }
  };

  return (
    <button
      className={`webauthn-authentication-button ${className}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? '인증 진행 중...' : '생체/PIN 인증으로 로그인'}
    </button>
  );
};

export default WebAuthnAuthenticationButton; 