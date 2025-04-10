import React from 'react';
import { formatWithKRW } from '@/shared/lib';

type Props = {
  title: string;
  paymentDate: number;
  amount: number;
  monthCount: number;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onModify: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showButtons?: boolean;
};

const FixedExpenseInfo = ({
  title,
  paymentDate,
  amount,
  monthCount,
  onClick,
  onModify,
  onDelete,
  showButtons = false,
}: Props) => {
  return (
    <li className="shadow-custom w-full list-none rounded-[1.25rem]">
      <div
        onClick={onClick}
        className="flex w-full cursor-pointer flex-col gap-3 rounded-[1.25rem] p-5"
      >
        <div className="flex w-full items-center justify-start gap-2">
          <strong className="xs:text-text-xl text-text-lg font-bold text-gray-900">{title}</strong>
        </div>

        <div className="flex w-full items-center justify-between">
          <span className="xs:text-text-md text-text-sm text-gray-600">
            매월 {paymentDate}일에 지출
          </span>
          <span className="xs:text-text-xl text-text-lg font-bold">{formatWithKRW(amount)}</span>
        </div>

        <div className="flex w-full items-center justify-between">
          <span className="xs:text-text-md text-text-sm text-extra">
            지난 {monthCount}개월 동안 고정지출
          </span>
          {showButtons && (
            <div className="flex gap-6" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={onModify}
                className="xs:text-text-md text-text-sm cursor-pointer text-gray-600"
              >
                수정
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="xs:text-text-md text-text-sm cursor-pointer text-gray-600"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default FixedExpenseInfo;
