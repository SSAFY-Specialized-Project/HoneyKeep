import {CertificateSelection} from "@/features/mydata/ui";

export const CertificateWidget = () => {

    return (
        <div className="flex flex-col h-full flex-1 p-6">
            <h1 className="text-2xl font-bold mb-2">안전한 계좌 연결을 위해</h1>
            <h2 className="text-2xl font-bold mb-6">인증 방법을 골라주세요</h2>

            <CertificateSelection />
        </div>
    );
};