import {useState} from 'react';
import {AgreementSection} from '../model/constants.ts';

interface Props {
    section: AgreementSection;
    checked: boolean;
    onToggle: () => void;
}

const AgreementCard = ({section, checked, onToggle}: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    // 커스텀 체크박스 클릭 시 토글 (이벤트 버블링 방지 포함)
    const handleCheckboxToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle();
    };

    return (
        <div className="mb-3 border border-gray-100 rounded-lg shadow-sm">
            <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    {/* 커스텀 네모 체크박스 */}
                    <div 
                        className="relative flex items-center justify-center w-5 h-5 mr-3 cursor-pointer"
                        onClick={handleCheckboxToggle} // div 클릭으로 토글 제어
                    >
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}} // 실제 변경은 div 클릭으로 처리
                            // 기본 스타일 숨김
                            className="appearance-none absolute w-full h-full border border-gray-400 rounded checked:bg-brand-primary-500 checked:border-brand-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-primary-300 transition-colors duration-150"
                        />
                        {/* 체크 표시 (흰색) */}
                        {checked && (
                            <svg className="absolute w-3 h-3 text-white pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <h3 className="font-semibold text-md" onClick={(e) => e.stopPropagation()}>{section.title}</h3> {/* 제목 클릭 시 아코디언 펼침 방지 */}
                </div>
                <div>
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <ul className="list-disc ml-5 space-y-2">
                        {section.items.map((item, index) => (
                            <li key={index} className="text-sm text-gray-700">{item}</li>
                        ))}
                    </ul>
                    {section.note && (
                        <p className="text-xs text-gray-600 mt-2">
                            {section.note}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AgreementCard; 