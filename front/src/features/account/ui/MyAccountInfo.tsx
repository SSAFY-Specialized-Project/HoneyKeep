import { getAllAccountAPI } from '@/entities/account/api';
import { Account } from '@/entities/account/model/types';
import { AccountInfo } from '@/entities/account/ui';
import { ResponseDTO } from '@/shared/model/types';
import { ContentAddBox, Icon } from '@/shared/ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import InfoBubble from '@/shared/ui/InfoBubble/InfoBubble';

const MyAccountInfo = () => {
  const navigate = useNavigate();
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);

  const toggleBubble = () => {
    setIsBubbleVisible((prev) => !prev);
  };

  const handleNotice = () => {
    // TODO: 알림 기능 구현
    // console.log('알림 클릭'); // 필요하면 유지
    toggleBubble();
  };

  const handleClick = (accountId: number) => {
    navigate(`/accountDetail/${accountId}/transactions`);
  };

  const { data: accountData } = useSuspenseQuery<ResponseDTO<Account[]>>({
    queryKey: ['accounts-info'],
    queryFn: getAllAccountAPI,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  return (
    <div className="xs:gap-2 flex flex-col gap-1.5">
      <div className="flex justify-between">
        <div className="xs:gap-2 relative flex gap-1.5">
          <h3 className="text-text-md xs:text-title-sm text-gray-900">내 계좌 정보</h3>
          <button type="button" onClick={handleNotice} className="cursor-pointer">
            <Icon size="small" id="notice" />
            {isBubbleVisible && (
              <div className="absolute left-3 z-10 mt-2.5 w-64 -translate-x-1/2">
                <InfoBubble />
              </div>
            )}
          </button>
        </div>
        <button
          type="button"
          className="text-text-xxs xs:text-text-sm xs:px-4 xs:py-2 cursor-pointer rounded-lg border border-gray-200 px-1.5 py-0.5 font-semibold text-gray-600"
          onClick={() => {
            navigate('/accountList');
          }}
        >
          편집
        </button>
      </div>
      {accountData != null && accountData.data.length > 0 ? (
        <ul className="xs:gap-3 flex flex-col gap-1.5">
          {accountData.data.map((item, index) => {
            if (index >= 2) return null;

            return (
              <AccountInfo
                key={item.accountNumber}
                bank={item.bankName}
                account={item.accountName}
                currentAmount={item.accountBalance}
                remainingAmount={item.spareBalance}
                onClick={() => handleClick(item.accountId)}
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
