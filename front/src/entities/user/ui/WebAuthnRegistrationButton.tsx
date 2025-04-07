import React, { useState } from 'react';
import { useWebAuthnRegistration } from '../hooks';

/**
 * WebAuthn 등록 버튼 컴포넌트의 속성 타입 정의
 * 
 * @property displayName - 사용자의 표시 이름 (서버에 저장됨)
 * @property deviceName - 사용자의 디바이스 이름 (사용자 인증기 식별을 위해 사용)
 * @property className - 버튼에 적용할 추가 CSS 클래스명
 * @property onSuccess - 등록 성공 시 호출될 콜백 함수
 * @property onError - 등록 실패 시 호출될 콜백 함수, 오류 객체를 매개변수로 받음
 */
interface WebAuthnRegistrationButtonProps {
  displayName?: string;
  deviceName?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * WebAuthn 등록 버튼 컴포넌트
 * 
 * WebAuthn 표준을 사용하여 사용자 디바이스의 생체인식/PIN 등을 통한 
 * 인증 방식을 등록합니다. 이 과정에서 다음과 같은 작업이 수행됩니다:
 * 
 * 1. 서버에 등록 시작 요청을 보내고 challenge를 받습니다.
 * 2. 브라우저의 WebAuthn API를 통해 사용자 인증기(생체/PIN)와 통신합니다.
 * 3. 인증기는 새 키 쌍(공개키/개인키)을 생성합니다.
 * 4. 개인키는 인증기 내부에 안전하게 저장됩니다(브라우저나 JS에서 접근 불가).
 * 5. 공개키와 관련 정보는 서버로 전송되어 사용자의 계정과 연결됩니다.
 * 
 * 이 방식은 기존 패스워드 기반 인증보다 강력한 보안성을 제공하며,
 * 피싱 공격에 취약하지 않은 인증 방식을 구현합니다.
 */
const WebAuthnRegistrationButton: React.FC<WebAuthnRegistrationButtonProps> = ({
  displayName,
  deviceName,
  className = '',
  onSuccess,
  onError,
}) => {
  // WebAuthn 등록 로직을 처리하는 커스텀 훅 사용
  const { isLoading, error, startRegistration } = useWebAuthnRegistration();
  
  // 디바이스 이름이 제공되지 않은 경우 사용자 입력을 받을 수 있는 상태 관리
  const [customDeviceName, setCustomDeviceName] = useState(deviceName || '');

  // 오류 발생 시 onError 콜백 호출
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  /**
   * 버튼 클릭 핸들러
   * 
   * 1. WebAuthn 등록 프로세스 시작
   * 2. 성공 시 onSuccess 콜백 호출
   * 3. 실패 시 콘솔에 오류 기록 (onError 콜백은 useEffect에서 처리)
   */
  const handleClick = async () => {
    try {
      // displayName이 없으면 빈 문자열 사용, deviceName이 없으면 사용자 입력값 사용
      await startRegistration(displayName || "", deviceName || customDeviceName);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('WebAuthn 등록 실패:', err);
    }
  };

  return (
    <button
      className={`webauthn-registration-button ${className}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? '등록 진행 중...' : '생체/PIN 인증으로 등록하기'}
    </button>
  );
};

export default WebAuthnRegistrationButton;