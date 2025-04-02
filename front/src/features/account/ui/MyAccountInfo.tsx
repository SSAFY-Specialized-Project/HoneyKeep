import { getAllAccountAPI } from "@/entities/account/api";
import { AccountDTO } from "@/entities/account/model/types";
import { AccountInfo } from "@/entities/account/ui";
import { ResponseDTO } from "@/shared/model/types";
import { ContentAddBox, Icon } from "@/shared/ui";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

const MyAccountInfo = () => {
  const navigate = useNavigate();
  const [noticeOpen, setNoticeOpen] = useState<boolean>(false);

  const { data: accountData } = useSuspenseQuery<ResponseDTO<AccountDTO[]>>({
    queryKey: ["accounts-info"],
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
        <div className="flex gap-2 relative">
          <h3 className="text-gray-900 text-title-sm">내 계좌 정보</h3>
          <button
            type="button"
            onClick={handleNotice}
            className="cursor-pointer"
          >
            <Icon size="small" id="notice" />
          </button>
          {/* 말풍선 달아야함 */}
        </div>
        <button
          type="button"
          className="px-4 py-2 border border-gray-200 rounded-lg text-text-sm font-semibold text-gray-600"
        >
          편집
        </button>
      </div>
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
            navigate("/myAgree");
          }}
        />
      )}
    </div>
  );
};

export default MyAccountInfo;
