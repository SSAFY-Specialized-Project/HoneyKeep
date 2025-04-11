import { formatWithKRW } from '@/shared/lib';

type Props = {
  count: number;
  totalAmount: number;
};

const FixedExpenseTotal = ({ count, totalAmount }: Props) => {
  return (
    <div className="shadow-custom w-full rounded-[1.25rem] bg-white">
      <div className="flex w-full flex-col gap-3 p-5">
        <div className="flex w-full items-center justify-between">
          <span className="text-text-lg xs:text-text-xl font-medium text-gray-600">
            내 고정지출
          </span>
          <span className="text-text-lg xs:text-text-xl font-medium text-gray-900">{count} 개</span>
        </div>

        <div className="flex w-full items-center justify-between">
          <span className="text-text-lg xs:text-text-xl font-medium text-gray-600">총 금액</span>
          <span className="text-text-lg xs:text-text-xl font-medium text-gray-900">
            {formatWithKRW(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FixedExpenseTotal;
