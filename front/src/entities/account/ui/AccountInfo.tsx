import { BankIcon } from "@/shared/ui";

interface Props {
  bank: string;
  account: string;
  currentAmount: number;
  remainingAmount: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickSend: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const AccountInfo = ({
  bank,
  account,
  currentAmount,
  remainingAmount,
  onClick,
  onClickSend,
}: Props) => {
  return (
    <li className="list-none w-full shadow-sm rounded-[1.25rem]">
      <button
        type="button"
        onClick={onClick}
        className="flex flex-col rounded-[1.25rem] w-full p-5 items-end gap-3"
      >
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <BankIcon />
            <div className="flex flex-col items-start">
              <strong className="text-text-xl text-gray-900 font-bold">
                {bank}
              </strong>
              <span className="text-text-sm text-gray-600 font-semibold">
                {account}
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="flex gap-1.5 justify-between">
              <span className="text-text-md text-gray-600">현재 금액</span>
              <span className="text-text-md">{currentAmount} 원</span>
            </div>
            <div className="flex gap-1.5 justify-between">
              <span className="text-text-md text-extra">여유 자산</span>
              <span className="text-text-md text-extra font-semibold">
                {remainingAmount} 원
              </span>
            </div>
            <button type="button" className="absolute -bottom-0 -left-2">
              {/* 정보 알려주는 아이콘 */}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onClickSend}
          className="px-3 py-2 rounded-lg text-gary-700 text-text-sm border border-gray-200"
        >
          송금하기
        </button>
      </button>
    </li>
  );
};

export default AccountInfo;
