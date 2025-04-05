import {AccountVerificationForm} from '@/features/certification/ui';
import {AccountVerification} from "@/entities/certification/model/types.ts";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {ResponseErrorDTO} from "@/shared/model/types.ts";
import {requestAccountAuthAPI} from "@/features/certification/api";
import {BankAuthForMydataRequest, BankAuthForMydataResponse} from "@/features/certification/model/types.ts";
import {ResponseDTO} from "@/shared/model/types";

export const KkulkipRegisterWidget = () => {
    const navigate = useNavigate();

    const requestAccountAuthMutation = useMutation<
        ResponseDTO<BankAuthForMydataResponse>,
        ResponseErrorDTO | Error,
        BankAuthForMydataRequest
    >({
        mutationFn: requestAccountAuthAPI,
        onSuccess: (response) => {
            if (response?.data) {
                console.log('인증 요청 완료: ', response.data);
                navigate('/verifyPin',{
                    state: {
                        accountNumber: response.data.accountNo
                    }
                });
            } else {
                console.warn('인증 요청은 성공했으나 응답 데이터가 예상과 다름:', response);
                requestAccountAuthMutation.reset();
            }
        },
        onError: (error) => {
            console.error('인증 요청 처리 중 에러 발생:', error);
        },
    });

    const handleSubmit = (data: AccountVerification) => {
        if (!data) return;

        console.log("1원 인증 요청 시작 - 요청 데이터:", {
            bankCode: data.bankCode,
            accountNo: data.accountNumber
        });

        requestAccountAuthMutation.mutate({
            bankCode: data.bankCode,
            accountNo: data.accountNumber
        });
    };

    const getErrorMessage = (error: ResponseErrorDTO | Error | null): string | null => {
        if (!error) return null;
        if ('message' in error) {
            return error.message || '계좌 인증 요청 중 오류가 발생했습니다.';
        }
        return '알 수 없는 오류가 발생했습니다.';
    };

    const errorMessage = getErrorMessage(requestAccountAuthMutation.error);

    return (
        <div className="flex flex-col h-full p-6 gap-8">
            <div>
                <h1 className="text-2xl font-bold mb-2">꿀킵 인증서를 발급합니다</h1>
                <h2 className="text-xl font-medium text-gray-700">어떤 계좌로 1원을 인증할까요?</h2>
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
                    {errorMessage}
                </div>
            )}

            <div className="h-full">
                <AccountVerificationForm
                    onSubmit={handleSubmit}
                    isLoading={requestAccountAuthMutation.isPending}
                />
            </div>
        </div>
    );
};