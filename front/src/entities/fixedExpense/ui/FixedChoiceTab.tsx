import React, { Dispatch, SetStateAction } from "react";

interface Props {
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}

const FixedChoiceTab = ({ activeTab, setActiveTab }: Props) => {
    return (
        <div className="flex w-full border-b border-gray-200">
            <button
                className={`flex-1 text-xl font-medium text-center py-2 border-b-2 ${
                    activeTab === "목록"
                        ? "text-brand-primary-600 font-bold border-brand-primary-600"
                        : "text-gray-600 border-transparent"
                }`}
                onClick={() => setActiveTab("목록")}
            >
                고정지출 목록
            </button>
            <button
                className={`flex-1 text-xl font-medium text-center py-2 border-b-2 ${
                    activeTab === "발견"
                        ? "text-brand-primary-600 font-bold border-brand-primary-600"
                        : "text-gray-600 border-transparent"
                }`}
                onClick={() => setActiveTab("발견")}
            >
                발견된 고정지출
                {activeTab !== "발견" && <span className="inline-block ml-1 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
        </div>
    );
};

export default FixedChoiceTab;
