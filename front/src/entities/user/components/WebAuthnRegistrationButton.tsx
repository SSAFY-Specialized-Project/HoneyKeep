import React, { useState } from 'react';
import { useWebAuthnRegistration } from '../hooks';

interface WebAuthnRegistrationButtonProps {
  displayName?: string;
  deviceName?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * WebAuthn 등록 버튼 컴포넌트
 * 플랫폼 인증기(PIN 입력 방식)를 사용하여 사용자 등록을 진행합니다.
 */
const WebAuthnRegistrationButton: React.FC<WebAuthnRegistrationButtonProps> = ({
  displayName,
  deviceName,
  className = '',
  onSuccess,
  onError,
}) => {
  const { isLoading, error, startRegistration } = useWebAuthnRegistration();
  const [customDeviceName, setCustomDeviceName] = useState(deviceName || '');

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleClick = async () => {
    try {
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