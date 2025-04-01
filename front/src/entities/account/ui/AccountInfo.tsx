import { Bank } from "@/shared/model/types";
import { BankIcon } from "@/shared/ui";

interface Props {
  bank: Bank;
  account: string;
  currentAmount: number;
  remainingAmount: number;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
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
  const accountName = account.split(" ")[1] + " " + account.split(" ")[2];

  return (
    <li className="list-none w-full shadow-custom rounded-[1.25rem]">
      <div
        role="button"
        onClick={onClick}
        className="flex flex-col rounded-[1.25rem] w-full p-5 items-end gap-3 cursor-pointer"
      >
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <BankIcon bank={bank} />
            <div className="flex flex-col items-start">
              <strong className="text-text-xl text-gray-900 font-bold">
                {bank}
              </strong>
              <span className="text-text-sm text-gray-600 font-semibold">
                {accountName}
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
          </div>
        </div>
        <button
          type="button"
          onClick={onClickSend}
          className="px-3 py-2 rounded-lg text-gary-700 text-text-sm border border-gray-200"
        >
          송금하기
        </button>
      </div>
    </li>
  );
};

export default AccountInfo;
