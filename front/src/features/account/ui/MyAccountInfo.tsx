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
    setIsBubbleVisible(prev => !prev);
  };

  const handleNotice = () => {
    // TODO: 알림 기능 구현
    // console.log('알림 클릭'); // 필요하면 유지
    toggleBubble();
  };

  const handleClick = (accountId : number) => {
    navigate(`/accountDetail/${accountId}`);
  }

  const { data: accountData } = useSuspenseQuery<ResponseDTO<Account[]>>({
    queryKey: ['accounts-info'],
    queryFn: getAllAccountAPI,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="relative flex items-center gap-2">
          <h3 className="text-title-sm text-gray-900">내 계좌 정보</h3>
          <button type="button" onClick={handleNotice} className="relative cursor-pointer text-gray-400 hover:text-gray-600">
            <Icon size="small" id="notice" />
            {isBubbleVisible && (
                <div className="absolute left-3 -translate-x-1/2 mt-2.5 z-10 w-64">
                  <InfoBubble />
                </div>
            )}
          </button>
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
                onClick={() => handleClick(item.accountId)}
                onClickSend={() => { }}
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
