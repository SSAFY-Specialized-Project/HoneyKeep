import { Bank } from '@/shared/model/types';
import { BankIcon } from '@/shared/ui';

interface Props {
  bank: Bank;
  account: string;
  accountNumber: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AccountCheck = ({ bank, account, accountNumber, checked, onChange }: Props) => {
  return (
    <div className="flex w-full justify-between px-4 py-5">
      <label htmlFor={accountNumber}>
        <div className="flex gap-3">
          <BankIcon bank={bank} />
          <div className="flex flex-col">
            <span className="text-text-md font-semibold text-gray-900">{account}</span>
            <div className="text-text-sm flex gap-2 text-gray-600">
              <span>{bank}</span>
              <span>{accountNumber}</span>
            </div>
          </div>
        </div>
      </label>
      <input
        type="checkbox"
        name={account}
        id={accountNumber}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};

export default AccountCheck;
