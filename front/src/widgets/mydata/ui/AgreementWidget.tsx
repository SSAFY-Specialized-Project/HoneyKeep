import {AgreementForm} from "@/features/mydata/ui";
import { useState } from "react";
import {FOOTER_TEXT} from "@/features/mydata/model/constants.ts";

interface AgreementWidgetProps {
    userName: string;
    onSubmit: () => void;
}

const AgreementWidget = ({userName, onSubmit}: AgreementWidgetProps) => {
    const [agreeEnabled, setAgreeEnabled] = useState(false);

    return (
        <div className="flex flex-col h-full">
            {/* 약관 부분 */}
            <div className="flex-1 overflow-y-auto">
                <AgreementForm
                    userName={userName}
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
                    onClick={onSubmit}
                    disabled={!agreeEnabled}
                >
                    동의하기
                </button>
            </div>
        </div>
    );
};

export default AgreementWidget;