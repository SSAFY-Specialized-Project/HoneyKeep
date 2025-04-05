import {AGREEMENT_SECTIONS} from '../model/constants.ts';
import {useState, useEffect} from 'react';
import {AgreementCard} from "@/features/mydata/ui/index.ts";

type Props = {
    userName: string;
    onAgreementChange?: (allChecked: boolean) => void;
}

const AgreementForm = ({userName, onAgreementChange}: Props) => {
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

            {/* 전체 동의 체크박스 */}
            <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleCheckAll}
                    className="w-5 h-5 mr-3 accent-brand-primary-500"
                />
                <span className="font-bold">전체 약관에 동의합니다</span>
            </div>

            {/* 약관 카드 리스트 */}
            <div className="mb-6">
                {AGREEMENT_SECTIONS.map((section) => (
                    <AgreementCard
                        key={section.id}
                        section={section}
                        checked={checkedSections[section.id]}
                        onToggle={() => toggleSection(section.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AgreementForm;
