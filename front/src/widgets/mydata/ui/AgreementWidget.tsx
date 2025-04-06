import {AgreementForm} from "@/features/mydata/ui";
import { useState } from "react";
import {FOOTER_TEXT} from "@/features/mydata/model/constants.ts";
import {useNavigate} from "react-router-dom";
import {useSuspenseQuery} from "@tanstack/react-query";
import {ResponseDTO} from "@/shared/model/types.ts";
import {UserResponse} from "@/entities/user/model/types.ts";
import {getMeAPI} from "@/entities/user/api";

const AgreementWidget = () => {
    const [agreeEnabled, setAgreeEnabled] = useState(false);
    const navigate = useNavigate();

    // 로그인된 유저의 정보를 불러온다.
    const {data: me} = useSuspenseQuery<ResponseDTO<UserResponse>, Error, UserResponse>({
        queryKey: ['user-info'],
        queryFn: getMeAPI,
        select: (response) => response.data,
        staleTime: 30 * 1000,
        gcTime: 60 * 1000,
    });

    const handleSubmit = () => {
        navigate("/mydata/certificates");
    };

    return (
        <div className="flex flex-col h-full">
            {/* 약관 부분 */}
            <div className="flex-1 overflow-y-auto">
                <AgreementForm
                    userName={me.name}
                    onAgreementChange={setAgreeEnabled}
                />
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 shadow-top">
                <div className="text-xs text-gray-500 mb-6">
                    {FOOTER_TEXT}
                </div>

                {/* 버튼 */}
                <button
                    className={`w-full rounded-xl py-4 font-bold text-lg ${
                        agreeEnabled 
                            ? "bg-brand-primary-500 text-white hover:bg-brand-primary-400" 
                            : "bg-gray-200 text-gray-500"
                    }`}
                    onClick={handleSubmit}
                    disabled={!agreeEnabled}
                >
                    동의하기
                </button>
            </div>
        </div>
    );
};

export default AgreementWidget;