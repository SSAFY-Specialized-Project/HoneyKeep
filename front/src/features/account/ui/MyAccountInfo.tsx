import { getAllAccountAPI } from '@/entities/account/api';
import { Account } from '@/entities/account/model/types';
import { AccountInfo } from '@/entities/account/ui';
import { ResponseDTO } from '@/shared/model/types';
import { ContentAddBox, Icon } from '@/shared/ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

const MyAccountInfo = () => {
  const navigate = useNavigate();

  const handleNotice = () => {
    // TODO: 알림 기능 구현
    console.log('알림 클릭');
  };

  const { data: accountData } = useSuspenseQuery<ResponseDTO<Account[]>>({
    queryKey: ['accounts-info'],
    queryFn: getAllAccountAPI,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="relative flex gap-2">
          <h3 className="text-title-sm text-gray-900">내 계좌 정보</h3>
          <button type="button" onClick={handleNotice} className="cursor-pointer">
            <Icon size="small" id="notice" />
          </button>
          {/* 말풍선 달아야함 */}
        </div>
        <button
          type="button"
          className="text-text-sm cursor-pointer rounded-lg border border-gray-200 px-4 py-2 font-semibold text-gray-600"
          onClick={() => {
            navigate('/accountList');
          }}
        >
          편집
        </button>
      </div>
      {accountData != null && accountData.data.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {accountData.data.map((item, index) => {
            if (index >= 2) return null;

            return (
              <AccountInfo
                key={item.accountNumber}
                bank={item.bankName}
                account={item.accountName}
                currentAmount={item.accountBalance}
                remainingAmount={item.spareBalance}
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
