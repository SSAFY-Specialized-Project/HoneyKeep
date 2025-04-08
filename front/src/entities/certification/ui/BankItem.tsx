import React from 'react';
import { Bank } from '../model/types';

interface BankItemProps {
  bank: Bank;
  isSelected: boolean;
  onSelect: (code: string) => void;
}

export const BankItem = ({ bank, isSelected, onSelect }: BankItemProps) => {
  const handleCheckboxChange = () => {
    onSelect(bank.code);
  };

  // 체크박스 클릭 시 이벤트 버블링 중단
  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${isSelected ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}
      onClick={() => onSelect(bank.code)}
    >
      <div className="flex items-center gap-3">
        {bank.icon && <img src={bank.icon} alt={`${bank.name} logo`} className="w-6 h-6" />}
        <span className="text-sm font-medium">{bank.name}</span>
      </div>

      <div className="relative flex items-center justify-center w-5 h-5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          onClick={handleCheckboxClick}
          className="appearance-none w-5 h-5 border border-gray-400 rounded-full checked:bg-brand-primary-300 checked:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-yellow-200 cursor-pointer transition-colors duration-150"
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