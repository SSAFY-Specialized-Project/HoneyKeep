import React from "react";
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
}

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
    <li className="list-none w-full shadow-custom rounded-[1.25rem]">
      <div
        onClick={onClick}
        className="flex flex-col w-full p-5 rounded-[1.25rem] gap-3 cursor-pointer"
      >
        <div className="flex justify-start items-center w-full gap-2">
          <strong className="text-text-xl text-gray-900 font-bold">
            {title}
          </strong>
        </div>

        <div className="flex justify-between items-center w-full">
          <span className="text-text-md text-gray-600">
            매월 {paymentDate}일에 지출
          </span>
          <span className="text-text-xl font-bold">
            {formatWithKRW(amount)}
          </span>
        </div>

        <div className="flex justify-between items-center w-full">
          <span className="text-text-md text-extra">
            지난 {monthCount}개월 동안 고정지출
          </span>
          {showButtons && (
            <div className="flex gap-6" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={onModify}
                className="text-text-md text-gray-600 cursor-pointer"
              >
                수정
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="text-text-md text-gray-600 cursor-pointer"
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
