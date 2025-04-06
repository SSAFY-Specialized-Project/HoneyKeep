import {useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import getCredentialsAPI from '@/entities/certification/api/getCredentialsAPI';
import {useWebAuthnAuthentication} from '@/entities/user/hooks/useWebAuthnAuthentication';

type UseCertificateAuthReturn = {
    isLoading: boolean;
    error: Error | null;
    startCertificateAuth: (certId: string) => Promise<void>;
};

/**
 * 인증서 인증 처리 통합 커스텀 훅
 *
 * 이 훅은 다음 기능을 제공합니다:
 * 1. 다양한 인증서 타입에 대한 인증 처리 로직 제공
 * 2. 인증서 ID에 따라 적절한 인증 프로세스 실행
 * 3. 인증 성공 또는 실패 시 적절한 경로로 이동
 */
export const useCertificateAuth = (): UseCertificateAuthReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();

    // WebAuthn 인증 훅
    const {startAuthentication} = useWebAuthnAuthentication();

    /**
     * 인증서 인증 시작
     * @param certId 인증서 ID (예: 'honey-cert', 'naver-cert')
     */
    const startCertificateAuth = useCallback(async (certId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            // 인증서 ID에 따라 다른 인증 로직 처리
            if (certId === 'honey-cert') {// 꿀킵 인증서(WebAuthn) 처리
                const response = await getCredentialsAPI();
                console.log(response);
                if (!response || !response.data || Array.isArray(response.data) && response.data.length === 0) {
                    console.log("등록된 꿀킵 인증서가 없습니다. 등록 페이지로 이동합니다.");
                    navigate(`/${certId}/register`);
                } else {
                    console.log("등록된 꿀킵 인증서가 있습니다. WebAuthn 인증을 시작합니다.");
                    const certResponse = await startAuthentication();
                    if (certResponse?.data.success) {
                        navigate('/mydata/accountConnect');
                    }
                    console.log(certResponse);
                }
            } else if (certId === 'naver-cert') {// 네이버 인증서 처리 로직
                console.log("네이버 인증서 인증을 시작합니다.");
                navigate(`/${certId}/auth`);
            } else {// 기타 인증서 처리
                console.log(`${certId} 인증서 인증을 시작합니다.`);
                navigate(`/${certId}/auth`);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '인증 중 오류가 발생했습니다.';
            setError(new Error(errorMessage));
            console.error(`${certId} 인증 오류:`, err);

            // 오류 발생 시 인증서 ID에 맞는 경로로 이동
            navigate(`/${certId}/register`);
        } finally {
            setIsLoading(false);
        }
    }, [navigate, startAuthentication]);

    return {
        isLoading,
        error,
        startCertificateAuth
    };
};

export default useCertificateAuth; 