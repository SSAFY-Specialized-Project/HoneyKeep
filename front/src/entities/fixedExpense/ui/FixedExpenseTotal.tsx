import { formatWithKRW } from '@/shared/lib';

type Props = {
  count: number;
  totalAmount: number;
}

const FixedExpenseTotal = ({ count, totalAmount }: Props) => {
  return (
    <div className="w-full shadow-custom rounded-[1.25rem] bg-white">
      <div className="flex flex-col w-full p-5 gap-3">
        <div className="flex justify-between items-center w-full">
          <span className="text-text-xl text-gray-600 font-medium">
            내 고정지출
          </span>
          <span className="text-text-xl text-gray-900 font-medium">
            {count} 개
          </span>
        </div>

        <div className="flex justify-between items-center w-full">
          <span className="text-text-xl text-gray-600 font-medium">
            총 금액
          </span>
          <span className="text-text-xl text-gray-900 font-medium">
            {formatWithKRW(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FixedExpenseTotal;
