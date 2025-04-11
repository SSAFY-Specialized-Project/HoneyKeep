import { BankIcon } from '@/shared/ui';
import { formatWithKRW } from '@/shared/lib';

interface Props {
  bank: string;
  account: string;
  accountNumber: string;
  currentAmount: number;
}

const AccountSimpleInfo = ({ bank, account, accountNumber, currentAmount }: Props) => {
  return (
    <div className="flex w-full items-center justify-between p-4">
      <div className="flex gap-3">
        <BankIcon bank="시티은행" />
        <div className="flex flex-col">
          <span className="text-text-md font-medium text-gray-800">{account}</span>
          <span className="text-text-sm font-medium text-gray-600">{`${bank} ${accountNumber}`}</span>
        </div>
      </div>
      <span className="">{formatWithKRW(currentAmount)}</span>
    </div>
  );
};

export default AccountSimpleInfo;
