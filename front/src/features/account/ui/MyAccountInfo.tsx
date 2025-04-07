import { getAllAccountAPI } from '@/entities/account/api';
import { Account } from '@/entities/account/model/types';
import { AccountInfo } from '@/entities/account/ui';
import { ResponseDTO } from '@/shared/model/types';
import { ContentAddBox } from '@/shared/ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

const MyAccountInfo = () => {
  const navigate = useNavigate();

  const { data: accountData } = useSuspenseQuery<ResponseDTO<Account[]>>({
    queryKey: ['accounts-info'],
    queryFn: getAllAccountAPI,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-title-sm text-gray-900">입출금계좌</h3>
      {accountData ? (
        <ul className="flex flex-col gap-3">
          {accountData.data.map((item) => {
            return (
              <AccountInfo
                key={item.accountNumber}
                bank={item.bankName}
                account={item.accountName}
                currentAmount={item.accountBalance}
                remainingAmount={1000}
                onClick={() => {}}
                onClickSend={() => {}}
              />
            );
          })}
        </ul>
      ) : (
        <ContentAddBox
          text="내 자산 추가하기"
          onClick={() => {
            navigate('/myAgree');
          }}
        />
      )}
    </div>
  );
};

export default MyAccountInfo;
