import { AccountPocketInfo } from '@/entities/account/ui';
import { getAllAccountAPI } from '@/entities/account/api';
import { Account } from '@/entities/account/model/types';
import { ResponseDTO } from '@/shared/model/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';

const AccountList = () => {
  const { data: accountData } = useSuspenseQuery<ResponseDTO<Account[]>>({
    queryKey: ['accounts-info'],
    queryFn: getAllAccountAPI,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  return (
    <div className="bg-brand-background flex flex-1 flex-col gap-5">
      <div className="flex flex-col gap-5">
        <h3 className="text-title-sm text-gray-900">입출금계좌</h3>
        {accountData && (
          <ul className="flex flex-col gap-3">
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
      <NavLink to="/myAgree" className="px-4 pb-4">
        <button
          type="button"
          className="text-text-md bg-brand-primary-500 hover:bg-brand-primary-600 w-full cursor-pointer rounded-lg p-4 font-medium text-white"
        >
          내 자산 추가하기
        </button>
      </NavLink>
    </div>
  );
};
export default AccountList;
