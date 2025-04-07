import { BankIcon } from '@/shared/ui';

interface Props {
  id: string;
  bank: string;
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
      <div className="flex w-full flex-col gap-2.5 p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-3">
            <BankIcon bank="시티은행" />
            <div className="flex flex-col">
              <span className="text-text-md font-medium text-gray-800">{account}</span>
              <span className="text-text-sm font-medium text-gray-600">{`${bank} ${accountNumber}`}</span>
            </div>
          </div>
          <span className="">{currentAmount} 원</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between">
            <span className="text-text-lg">포켓 후 잔액</span>
            <span className="text-text-lg text-extra font-semibold">{remainingAmount} 원</span>
          </div>
          <div className="flex w-full justify-between">
            <span className="text-text-sm text-gray-600">연결된 포켓</span>
            <span className="text-text-sm text-gray-600">{pocketCount} 개</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default AccountPocketInfo;
