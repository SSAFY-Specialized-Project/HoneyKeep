import { useQuery } from '@tanstack/react-query';
import { getAccountTransactionPocket } from '../api';
import { useEffect } from 'react';
import { addCommas } from '@/shared/lib';

interface Props {
  bankName: string;
  accountName: string;
  accountId: number;
  accountBalance: number;
}

const QRAccount = ({ bankName, accountName, accountId, accountBalance }: Props) => {
  const { data: accountData } = useQuery({
    queryFn: () => getAccountTransactionPocket(accountId),
    queryKey: ['account', accountId],
    staleTime: 20 * 60 * 1000,
  });

  useEffect(() => {
    console.log(accountData);
  }, [accountData]);

  if (!accountData) return null;

  return (
    <div
      onClick={() => {}}
      className="embla__slide bg-brand-primary-500 flex flex-col gap-6 rounded-xl p-3"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex h-full flex-col justify-between"
      >
        <div className="flex items-end gap-2">
          <span className="text-text-lg font-bold text-white">{bankName}</span>
          <span className="text-text-sm text-white">{accountName}</span>
        </div>
        <div className="flex w-full justify-between">
          <span className="text-text-sm font-bold text-white">보유 잔액</span>
          <span className="text-text-sm font-bold text-white">{addCommas(accountBalance)}원</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-text-sm font-bold text-white">출금 포켓</span>
      </div>
    </div>
  );
};

export default QRAccount;
