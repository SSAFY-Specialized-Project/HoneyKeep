import { Bank } from '@/shared/model/types';
import { BankIcon } from '@/shared/ui';
import { formatWithKRW } from '@/shared/lib';

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
  const accountName = account.split(' ')[1] + ' ' + account.split(' ')[2];

  return (
    <li className="shadow-custom w-full list-none rounded-[1.25rem]">
      <div
        role="button"
        onClick={onClick}
        className="xs:gap-3 xs:p-5 flex w-full cursor-pointer flex-col items-end gap-2 rounded-[1.25rem] p-4"
      >
        <div className="flex w-full justify-between">
          <div className="flex gap-2">
            <BankIcon bank={bank} />
            <div className="flex flex-col items-start">
              <strong className="text-text-lg xs:text-text-xl font-bold text-gray-900">
                {bank}
              </strong>
              <span className="text-text-xs xs:text-text-sm font-semibold text-gray-600">
                {accountName}
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="flex justify-between gap-1.5">
              <span className="text-text-sm xs:text-text-md text-gray-600">현재 금액</span>
              <span className="text-text-sm xs:text-text-md">{formatWithKRW(currentAmount)}</span>
            </div>
            <div className="flex justify-between gap-1.5">
              <span className="text-text-sm xs:text-text-md text-extra">여유 자산</span>
              <span className="text-text-sm xs:text-text-md text-extra font-semibold">
                {formatWithKRW(remainingAmount)}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClickSend}
          className="text-gary-700 text-text-xs xs:text-text-sm xs:px-3 xs:py-2 cursor-pointer rounded-lg border border-gray-200 px-2 py-1 hover:bg-gray-100"
        >
          송금하기
        </button>
      </div>
    </li>
  );
};

export default AccountInfo;
