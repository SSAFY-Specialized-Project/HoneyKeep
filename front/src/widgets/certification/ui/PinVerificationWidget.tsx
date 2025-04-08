import {useState} from 'react';
import {PinVerificationForm} from '@/features/certification/ui';
import {PinVerification} from "@/entities/certification/model/types";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {ResponseDTO, ResponseErrorDTO} from "@/shared/model/types.ts";
import {AccountVerifyForMydataRequest} from "@/features/certification/model/types.ts";
import {verifyAccountAuthAPI} from "@/features/certification/api";
import {useNavigate} from "react-router";
import {useWebAuthnRegistration} from "@/entities/user/hooks";
import {UserResponse} from "@/entities/user/model/types.ts";
import {getMeAPI} from "@/entities/user/api";

type Props = {
    accountNumber: string;
}

export const PinVerificationWidget = ({accountNumber}: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {startRegistration} = useWebAuthnRegistration();

    // 로그인된 유저의 정보를 불러온다.
    const {data: me} = useSuspenseQuery<ResponseDTO<UserResponse>, Error, UserResponse>({
        queryKey: ['user-info'],
        queryFn: getMeAPI,
        select: (response) => response.data,
        staleTime: 30 * 1000,
        gcTime: 60 * 1000,
    });

    // 1원 인증 검증 api 호출 후 절차 정의
    const verifyAccountAuthMutation = useMutation<
        ResponseDTO<void>,
        ResponseErrorDTO | Error,
        AccountVerifyForMydataRequest
    >({
        mutationFn: verifyAccountAuthAPI,
        onSuccess: (response) => {
            if (response?.status === 200) {
                console.log('인증 요청 완료: ', response);
                // todo: 인증 등록 절차 진행. 로그인된 유저의 이름으로 displayName 설정하기 .
                console.log(me);
                startRegistration(me.name);
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

export default PinVerificationWidget;