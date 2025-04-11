import { addCommas, formatTime } from '@/shared/lib';

interface Props {
  id: number;
  name: string;
  amount: number;
  balance: number;
  date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
}

const TransactionListItem = ({ id, name, amount, balance, date, type }: Props) => {
  const isDeposit = type === 'DEPOSIT';
  const amountColorClass = 'text-blue-600';

  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3">
      {/* 왼쪽: 시간 & 거래처명 */}
      <div className="flex space-x-3">
        <span className="w-10 flex-shrink-0 text-sm text-gray-500">{formatTime(date)}</span>{' '}
        {/* 시간 (고정폭) */}
        <span className="truncate text-sm text-gray-800">{name}</span>
      </div>

      {/* 오른쪽: 금액 & 잔액 */}
      <div className="ml-2 flex flex-col items-end">
        <span className={`text-sm font-semibold ${isDeposit ? amountColorClass : null}`}>
          {isDeposit ? '+' : '−'}
          {addCommas(Math.abs(amount))} 원
        </span>
        <span className="mt-0.5 text-xs text-gray-500">{addCommas(balance)}원</span>
      </div>
    </div>
  );
};

export default TransactionListItem;
