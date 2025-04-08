import { addCommas } from '@/shared/lib';

interface Props {
  id: number;
  name: string;
  amount: number;
  balance: number;
  date: string;
}

const TransactionListItem = ({ name, amount, balance, date }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-text-sm text-gray-600">{date}</div>
        <div className="text-text-md text-gray-900">
          {amount < 0 ? '-' : '+'}
          {addCommas(Math.abs(amount))} 원
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-text-md text-gray-900">{name}</div>
        <div className="text-text-sm text-gray-600">잔액 {addCommas(balance)}원</div>
      </div>
    </div>
  );
};

export default TransactionListItem;
