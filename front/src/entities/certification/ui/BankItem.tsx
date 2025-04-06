import React from 'react';
import { Bank } from '../model/constants'; // Import the Bank type

interface BankItemProps {
  bank: Bank;
  isSelected: boolean;
  onSelect: (code: string) => void;
}

export const BankItem: React.FC<BankItemProps> = ({ bank, isSelected, onSelect }) => {
  const handleCheckboxChange = () => {
    onSelect(bank.code);
  };

  // 체크박스 클릭 시 이벤트 버블링 중단
  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    // onChange가 이미 handleCheckboxChange를 호출하므로 여기서는 호출 X
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-150 ${ // transition 추가
        isSelected ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-gray-100' // 선택 시 노란색 배경
      }`}
      onClick={handleCheckboxChange} // Allow clicking the whole row
    >
      <div className="flex items-center gap-3">
        {bank.icon ? (
          <img src={bank.icon} alt={`${bank.name} logo`} className="w-6 h-6" />
        ) : (
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div> // Placeholder for missing icons
        )}
        <span className="text-sm">{bank.name}</span>
      </div>
      {/* 동그라미 체크박스 스타일 */}
      <div className="relative flex items-center justify-center w-5 h-5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange} // 상태 변경 시 호출
          onClick={handleCheckboxClick} // 클릭 시 버블링 방지
          // 체크박스 색상을 더 연한 파스텔톤으로 변경
          className="appearance-none w-5 h-5 border border-gray-400 rounded-full checked:bg-yellow-300 checked:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-yellow-200 cursor-pointer transition-colors duration-150"
          aria-label={`${bank.name} 선택`}
        />
        {/* 체크 표시 (선택됐을 때만 보임) */}
        {isSelected && (
          <svg className="absolute w-3 h-3 text-white pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </div>
  );
}; 