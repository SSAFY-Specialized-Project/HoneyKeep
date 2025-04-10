import { BankIcon } from '@/shared/ui';
import { formatWithKRW } from '@/shared/lib';
import { Bank } from '@/shared/model/types.ts';

interface Props {
  id: string;
  bank: Bank;
  account: string;
  accountNumber: string;
  currentAmount: number;
  remainingAmount: number;
  pocketCount: number;
}

const AccountPocketInfo = ({
  bank,
  account,
  accountNumber,
  currentAmount,
  remainingAmount,
  pocketCount,
}: Props) => {
  return (
    <li className="shadow-custom w-full list-none rounded-[1.25rem]">
      <div className="xs:gap-2.5 xs:p-4 flex w-full flex-col gap-2 p-3">
        <div className="flex w-full items-center justify-between">
          <div className="xs:gap-3 flex gap-2">
            <BankIcon bank={bank} />
            <div className="flex flex-col">
              <span className="text-text-sm xs:text-text-md font-medium text-gray-800">
                {account}
              </span>
              <span className="text-text-xs xs:text-text-sm font-medium text-gray-600">{`${bank} ${accountNumber}`}</span>
            </div>
          </div>
          <span className="text-text-sm xs:text-text-md">{formatWithKRW(currentAmount)}</span>
        </div>
        <div className="xs:gap-2 flex flex-col gap-1.5">
          <div className="flex w-full justify-between">
            <span className="text-text-md xs:text-text-lg">포켓 후 잔액</span>
            <span className="text-text-md xs:text-text-lg text-extra font-semibold">
              {formatWithKRW(remainingAmount)}
            </span>
          </div>
          <div className="flex w-full justify-between">
            <span className="text-text-xs xs:text-text-sm text-gray-600">연결된 포켓</span>
            <span className="text-text-xs xs:text-text-sm text-gray-600">{pocketCount} 개</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default AccountPocketInfo;
