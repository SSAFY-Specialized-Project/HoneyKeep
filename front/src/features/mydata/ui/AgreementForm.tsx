import { AGREEMENT_SECTIONS } from '../model/constants.ts';
import { useState, useEffect } from 'react';
import { AgreementCard } from "@/features/mydata/ui/index.ts";

type Props = {
    userName: string;
    onAgreementChange?: (allChecked: boolean) => void;
}

const AgreementForm = ({ userName, onAgreementChange }: Props) => {
    const [checkedSections, setCheckedSections] = useState<Record<string, boolean>>({});

    const toggleSection = (sectionId: string) => {
        setCheckedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const allChecked = AGREEMENT_SECTIONS.every(section => checkedSections[section.id]);

    const handleCheckAll = () => {
        if (allChecked) {
            // 모두 해제
            const newState = {} as Record<string, boolean>;
            AGREEMENT_SECTIONS.forEach(section => {
                newState[section.id] = false;
            });
            setCheckedSections(newState);
        } else {
            // 모두 체크
            const newState = {} as Record<string, boolean>;
            AGREEMENT_SECTIONS.forEach(section => {
                newState[section.id] = true;
            });
            setCheckedSections(newState);
        }
    };

    // allChecked 상태가 변경될 때마다 상위 컴포넌트에 알림
    useEffect(() => {
        onAgreementChange?.(allChecked);
    }, [allChecked, onAgreementChange]);

    return (
        <div className="p-6 flex flex-col text-sm text-gray-900">
            <h1 className="text-xl font-bold mb-2">{userName}님의 계좌를</h1>
            <h2 className="text-xl font-bold mb-6">확인하기 위한 동의문이에요</h2>

            {/* 전체 동의 체크박스 - 커스텀 스타일 적용 */}
            <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                {/* 커스텀 네모 체크박스 */}
                <div
                    className="relative flex items-center justify-center w-5 h-5 mr-3 cursor-pointer"
                    onClick={handleCheckAll} // div 클릭으로 토글 제어
                >
                    <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={() => { }} // 실제 변경은 div 클릭으로 처리
                        // 기본 스타일 숨김
                        className="appearance-none absolute w-full h-full border border-gray-400 rounded checked:bg-brand-primary-500 checked:border-brand-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-primary-300 transition-colors duration-150"
                        aria-label="전체 약관 동의"
                    />
                    {/* 체크 표시 (흰색) */}
                    {allChecked && (
                        <svg className="absolute w-3 h-3 text-white pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                <span className="font-bold cursor-pointer" onClick={handleCheckAll}>전체 약관에 동의합니다</span> {/* 텍스트 클릭으로도 토글 */}
            </div>

            {/* 약관 카드 리스트 */}
            <div className="mb-6">
                {AGREEMENT_SECTIONS.map((section) => (
                    <AgreementCard
                        key={section.id}
                        section={section}
                        checked={checkedSections[section.id] ?? false}
                        onToggle={() => toggleSection(section.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AgreementForm;
