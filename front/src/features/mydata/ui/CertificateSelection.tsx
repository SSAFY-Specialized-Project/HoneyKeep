import {useState} from 'react';
import {Certificate} from '@/entities/certification/model/types';
import {CertificateCard} from '@/entities/certification/ui/CertificateCard';
import {CERTIFICATES} from '@/entities/certification/model/constants';
import {useCertificateAuth} from '@/features/auth/hooks/useCertificateAuth';

export const CertificateSelection = () => {
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
    const {startCertificateAuth} = useCertificateAuth();

    const handleSelect = async (cert: Certificate) => {
        setSelectedCert(cert);

        try {
            // 모든 인증서 타입을 하나의 통합 훅으로 처리
            await startCertificateAuth(cert.id);
        } catch (error) {
            console.error(`${cert.name} 인증 처리 중 오류:`, error);
        }
    };

    return (
        <div className="space-y-4">
            {CERTIFICATES.map(cert => (
                <CertificateCard
                    key={cert.id}
                    certificate={cert}
                    onClick={handleSelect}
                />
            ))}

            <button
                className="text-gray-500 text-sm text-center w-full mt-4"
            >
                다른 인증서 사용하기
            </button>
        </div>
    );
};

export default CertificateSelection;