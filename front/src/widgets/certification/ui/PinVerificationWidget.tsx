import {useState} from 'react';
import {PinVerificationForm} from '@/features/certification/ui';
import {PinVerification} from "@/entities/certification/model/types";
import {useMutation} from "@tanstack/react-query";
import {ResponseDTO, ResponseErrorDTO} from "@/shared/model/types.ts";
import {
    AccountVerifyForMydataRequest,
    BankAuthForMydataRequest,
    BankAuthForMydataResponse
} from "@/features/certification/model/types.ts";
import {verifyAccountAuthAPI} from "@/features/certification/api";
import {useNavigate} from "react-router";

type Props = {
    accountNumber: string;
}

export const PinVerificationWidget = ({accountNumber}: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const verifyAccountAuthMutation = useMutation<
        ResponseDTO<void>,
        ResponseErrorDTO | Error,
        AccountVerifyForMydataRequest
    >({
        mutationFn: verifyAccountAuthAPI,
        onSuccess: (response) => {
            if (response?.status === 200) {
                console.log('인증 요청 완료: ', response);
                // todo: 인증 등록 절차 진행
                navigate('/mydata/certificates');
            } else {
                console.warn('인증 요청은 성공했으나 응답 데이터가 예상과 다름:', response);
                verifyAccountAuthMutation.reset();
            }
        },
        onError: (error) => {
            console.error('인증 검증 처리 중 에러 발생:', error);
        },
    });

    const handleSubmit = async (data: PinVerification) => {
        if (!data) return;

        try {
            setIsLoading(true);
            console.log("PIN 인증 시작", data);
            verifyAccountAuthMutation.mutate({
                accountNo: data.accountNumber,
                authCode: data.pin
            });
        } catch (err) {
            setError('인증 처리 중 오류가 발생했습니다.');
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 bg-white">
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
                    {error}
                </div>
            )}

            <div className="h-full">
                <PinVerificationForm
                    accountNumber={accountNumber}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}; 