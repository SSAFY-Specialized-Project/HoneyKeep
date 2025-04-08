import React, {useState} from 'react';
import {AccountVerification} from '@/entities/certification/model/types';
import BasicInput from '@/shared/ui/BasicInput/BasicInput';
import { BANK_LIST } from '@/entities/certification/model/constants';

interface Props {
    onSubmit: (data: AccountVerification) => void;
    isLoading?: boolean;
}

export const AccountVerificationForm = ({onSubmit, isLoading = false}: Props) => {
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
        onSubmit({accountNumber, bankCode});
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 h-full justify-between"
        >
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
                        className={`w-full border-0 h-[4.375rem] px-4 relative rounded-2xl bg-gray-100 flex items-center`}>
                        <select
                            id="bankCode"
                            value={bankCode}
                            onChange={(e) => {
                                setBankCode(e.target.value);
                                if (error) setError(null);
                            }}
                            className="w-full h-full py-4 appearance-none focus:outline-none bg-transparent font-semibold text-text-xl"
                            disabled={isLoading}
                        >
                            <option value="">은행을 선택해주세요</option>
                            {BANK_LIST.map(bank => (
                                <option key={bank.code} value={bank.code}>{bank.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    {error && error.includes('은행') && (
                        <span className="px-4 text-text-sm text-warning font-normal mt-1">
                            {error}
                        </span>
                    )}
                </div>
            </div>
            <button
                type="submit"
                className="w-full bg-yellow-400 text-white rounded-xl py-4 font-bold"
            >
                확인
            </button>
        </form>
    );
};

export default AccountVerificationForm;