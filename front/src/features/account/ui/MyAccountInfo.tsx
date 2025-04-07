import { getAllAccountAPI } from '@/entities/account/api';
import { Account } from '@/entities/account/model/types';
import { AccountInfo } from '@/entities/account/ui';
import { ResponseDTO } from '@/shared/model/types';
import { ContentAddBox, Icon } from '@/shared/ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const MyAccountInfo = () => {
  const navigate = useNavigate();
  const [noticeOpen, setNoticeOpen] = useState<boolean>(false);

  const { data: accountData } = useSuspenseQuery<ResponseDTO<Account[]>>({
    queryKey: ['accounts-info'],
    queryFn: getAllAccountAPI,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  const handleNotice = () => {
    setNoticeOpen(!noticeOpen);
  };

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
          className="text-text-sm rounded-lg border border-gray-200 px-4 py-2 font-semibold text-gray-600"
        >
          편집
        </button>
      </div>
      {accountData != null ? (
        <ul className="flex flex-col gap-3">
          {accountData.data.map((item) => {
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
