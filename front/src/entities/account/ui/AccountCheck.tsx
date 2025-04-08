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
      <div
        onClick={() => {
          const dummyEvent = {
            target: {
              checked: !checked,
              name: account,
              id: accountNumber,
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(dummyEvent);
        }}
        className="cursor-pointer"
      >
        <img
          src={checked ? '/icon/assets/cheked.svg' : '/icon/assets/unchecked.svg'}
          alt={checked ? '선택됨' : '선택되지 않음'}
          width={24}
          height={24}
        />
      </div>
    </div>
  );
};

export default AccountCheck;
