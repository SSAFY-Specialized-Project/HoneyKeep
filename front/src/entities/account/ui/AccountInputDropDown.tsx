import { Bank } from '@/shared/model/types';
import { BankIcon, Icon } from '@/shared/ui';
import { useState } from 'react';
import { getAllAccountAPI } from '../api';
import { useQuery } from '@tanstack/react-query';
import AccountCheck from './AccountCheck';

// 비활성화 경고
// accountID를 받아야함

interface Props {
  accountId: number | null;
  setAccountId: React.Dispatch<React.SetStateAction<number | null>>;
  setAccountBalance: React.Dispatch<React.SetStateAction<number | null>>;
}

const AccountInfoDropDown = ({ accountId, setAccountId, setAccountBalance }: Props) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [bankName, setBankName] = useState<Bank | null>(null);

  const { data: accountData } = useQuery({
    queryKey: ['accounts-info'],
    queryFn: getAllAccountAPI,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  return (
    <div>
      <button
        className="flex w-full justify-between rounded-2xl border border-gray-200 px-4 py-5"
        onClick={() => {
          setOpen(!isOpen);
        }}
      >
        {accountId && bankName ? (
          <div className="flex gap-3">
            <BankIcon bank={bankName} />
            <div className="flex flex-col">
              <span className="text-text-md font-semibold text-gray-900">{accountName}</span>
              <div className="text-text-sm flex gap-2 text-gray-600">
                <span>{bankName}</span>
                <span>{accountNumber}</span>
              </div>
            </div>
          </div>
        ) : (
          <span className="text-text-lg font-bold text-gray-600">연결할 계좌를 선택해주세요.</span>
        )}
        <Icon size="small" isRotate={isOpen} id="chevron-down" />
      </button>
      <ul
        className={`shadow-custom flex flex-col gap-2.5 overflow-auto rounded-2xl transition-all duration-300 ${isOpen ? 'max-h-50 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {accountData && accountData.data != null
          ? accountData.data.map((item) => {
              return (
                <li key={item.accountNumber}>
                  <AccountCheck
                    bank={item.bankName}
                    account={item.accountName}
                    accountNumber={item.accountNumber}
                    checked={accountNumber == item.accountNumber}
                    onChange={() => {
                      setBankName(item.bankName);
                      setAccountId(null);
                      setAccountName(item.accountName);
                      setAccountNumber(item.accountNumber);
                      setAccountBalance(item.accountBalance);
                    }}
                  />
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default AccountInfoDropDown;
