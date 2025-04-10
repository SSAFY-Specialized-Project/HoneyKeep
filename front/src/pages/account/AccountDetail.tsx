import { useEffect } from 'react';
import { useHeaderStore } from '@/shared/store';
import { AccountPocketInfo } from '@/entities/account/ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ResponseDTO } from '@/shared/model/types';
import type { AccountDetail } from '@/entities/account/model/types';
import getAccountTransactionPocket from '@/entities/account/api/getAccountTransactionPocket';
import { Outlet, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import AccountChoiceTab from '@/entities/account/ui/AccountChoiceTab';

const AccountDetail = () => {
  const { setTitle } = useHeaderStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId } = useParams();

  const { data: accountData } = useSuspenseQuery<ResponseDTO<AccountDetail>>({
    queryKey: ['account-detail', accountId],
    queryFn: () => {
      if (!accountId) throw new Error('계좌 ID가 필요합니다');
      return getAccountTransactionPocket(Number(accountId));
    },
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  useEffect(() => {
    console.log('Account Detail Data:', accountData);
  }, [accountData]);

  useEffect(() => {
    setTitle('저축예금계좌');
    return () => {
      setTitle('');
    };
  }, [setTitle]);

  // 현재 경로가 루트일 경우 transactions로 리다이렉트
  useEffect(() => {
    if (location.pathname.endsWith('detail')) {
      navigate('transactions', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="relative bg-brand-background flex h-full flex-1 flex-col px-6 py-4">
      {/* 계좌 정보 섹션 */}
      <div className="mb-5">
        {accountData && (
          <AccountPocketInfo
            id={accountData.data.accountNumber}
            bank={accountData.data.bankName}
            account={accountData.data.accountName}
            accountNumber={accountData.data.accountNumber}
            currentAmount={accountData.data.accountBalance}
            remainingAmount={accountData.data.accountBalance - accountData.data.totalPocketAmount}
            pocketCount={accountData.data.pocketCount}
          />
        )}
      </div>

      {/* 탭 */}
      <AccountChoiceTab />

      {/* 탭 내용 */}
      <div className="flex flex-1 flex-col px-2 py-4 overflow-auto">
        <Outlet context={{ accountData: accountData?.data }} />
      </div>

      {/* 송금하기 버튼 */}
      <Link
        to="/"
        className="bg-brand-primary-500 py-2.5 text-title-md cursor-pointer rounded-xl text-center font-bold text-white"
      >
        송금하기
      </Link>
    </div>
  );
};
export default AccountDetail;
