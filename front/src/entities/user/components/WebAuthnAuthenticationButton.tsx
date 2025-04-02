import React from 'react';
import { useWebAuthnAuthentication } from '../hooks';

interface WebAuthnAuthenticationButtonProps {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * WebAuthn 인증 버튼 컴포넌트
 * 사용자가 등록한 생체/PIN 인증 방식을 사용하여 로그인을 시도합니다.
 */
const WebAuthnAuthenticationButton: React.FC<WebAuthnAuthenticationButtonProps> = ({
  className = '',
  onSuccess,
  onError,
}) => {
  const { isLoading, error, startAuthentication } = useWebAuthnAuthentication();

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

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