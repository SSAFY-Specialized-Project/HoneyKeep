import React, { useState } from 'react';
import { AccountVerification } from '@/entities/certification/model/types';
import BasicInput from '@/shared/ui/BasicInput/BasicInput';
import { BANK_LIST } from '@/entities/certification/model/constants';

interface Props {
  onSubmit: (data: AccountVerification) => void;
  isLoading?: boolean;
}

export const AccountVerificationForm = ({ onSubmit, isLoading = false }: Props) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountNumber.trim()) {
      setError('계좌번호를 입력해주세요.');
      return;
    }

    if (!bankCode) {
      setError('은행을 선택해주세요.');
      return;
    }

    setError(null);
    onSubmit({ accountNumber, bankCode });
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col justify-between">
      <div className="space-y-6">
        <BasicInput
          id="accountNumber"
          name="accountNumber"
          type="text"
          label="계좌번호"
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value);
            if (error) setError(null);
          }}
          errorMessage={error && error.includes('계좌번호') ? error : ''}
        />

        <div className="relative mt-4">
          <div
            className={`relative flex h-[4.375rem] w-full items-center rounded-2xl border-0 bg-gray-100 px-4`}
          >
            <select
              id="bankCode"
              value={bankCode}
              onChange={(e) => {
                setBankCode(e.target.value);
                if (error) setError(null);
              }}
              className="text-text-xl h-full w-full appearance-none bg-transparent py-4 font-semibold focus:outline-none"
              disabled={isLoading}
            >
              <option value="">은행을 선택해주세요</option>
              {BANK_LIST.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          {error && error.includes('은행') && (
            <span className="text-text-sm text-warning mt-1 px-4 font-normal">{error}</span>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full cursor-pointer rounded-xl bg-yellow-400 py-4 font-bold text-white"
      >
        확인
      </button>
    </form>
  );
};

export default AccountVerificationForm;
