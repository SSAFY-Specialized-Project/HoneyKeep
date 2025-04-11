import React from 'react';
import { formatWithKRW } from '@/shared/lib';

type Props = {
  title: string;
  paymentDate: number;
  amount: number;
  monthCount: number;
  onRegister: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const FixedExpenseFound = ({
  title,
  paymentDate,
  amount,
  monthCount,
  onRegister,
  onDelete,
}: Props) => {
  return (
    <li className="shadow-custom w-full list-none rounded-[1.25rem]">
      <div className="flex w-full flex-col gap-3 rounded-[1.25rem] p-5">
        <div className="flex w-full items-center justify-between">
          <strong className="text-text-lg xs:text-text-xl font-bold text-gray-900">{title}</strong>
          <span className="text-text-lg xs:text-text-xl font-bold">{formatWithKRW(amount)}</span>
        </div>

        <div className="flex w-full items-center justify-start">
          <span className="text-text-sm xs:text-text-md text-gray-600">
            매월 {paymentDate}일에 지출
          </span>
        </div>

        <div className="flex w-full items-center justify-start">
          <span className="text-text-sm xs:text-text-md text-extra">
            지난 {monthCount}개월 동안 고정 지출
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onRegister}
            className="text-text-sm xs:text-text-md xs:w-24 xs:px-[14px] xs:py-2 w-20 cursor-pointer rounded-lg bg-[var(--color-brand-primary-500)] px-2 py-1.5 text-white"
          >
            등록
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="text-text-sm xs:text-text-md xs:w-24 xs:px-[14px] xs:py-2 w-20 cursor-pointer rounded-lg bg-gray-100 px-2 py-1.5 text-gray-900"
          >
            삭제
          </button>
        </div>
      </div>
    </li>
  );
};

export default FixedExpenseFound;
