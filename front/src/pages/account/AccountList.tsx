import { AccountPocketInfo } from '@/entities/account/ui';
import { getAllAccountAPI } from '@/entities/account/api';
import { Account } from '@/entities/account/model/types';
import { ResponseDTO } from '@/shared/model/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, NavLink } from 'react-router-dom';
import { useHeaderStore } from '@/shared/store';
import { useEffect } from 'react';

const AccountList = () => {
  const { setTitle } = useHeaderStore();

  useEffect(() => {
    setTitle('내 계좌');
    return () => {
      setTitle('');
    };
  }, [setTitle]);

  const { data: accountData } = useSuspenseQuery<ResponseDTO<Account[]>>({
    queryKey: ['accounts-info'],
    queryFn: getAllAccountAPI,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  return (
    <div className="bg-brand-background flex h-full flex-1 flex-col gap-5 px-5">
      <div className="flex h-full flex-col gap-5">
        <h3 className="text-title-sm text-gray-900">입출금계좌</h3>
        {accountData && (
          <ul className="flex h-full flex-col gap-3">
            {accountData.data.map((item) => (
              <NavLink key={item.accountNumber} to={`/accountDetail/${item.accountId}/detail`}>
                <AccountPocketInfo
                  id={String(item.accountId)}
                  bank={item.bankName}
                  account={item.accountName}
                  accountNumber={item.accountNumber}
                  currentAmount={item.accountBalance}
                  remainingAmount={item.accountBalance - item.totalPocketAmount}
                  pocketCount={item.pocketCount}
                />
              </NavLink>
            ))}
          </ul>
        )}
      </div>
      <Link
        to="/mydata"
        className="bg-brand-primary-500 text-title-md mt-3 mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white"
      >
        내 자산 추가하기
      </Link>
    </div>
  );
};
export default AccountList;
