import React from "react";

interface Props {
  title: string;
  paymentDate: number;
  amount: number;
  monthCount: number;
  onRegister: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FixedExpenseFound = ({
  title,
  paymentDate,
  amount,
  monthCount,
  onRegister,
  onDelete,
}: Props) => {
  return (
    <li className="list-none w-full shadow-custom rounded-[1.25rem]">
      <div className="flex flex-col w-full p-5 rounded-[1.25rem] gap-3">
        <div className="flex justify-between items-center w-full">
          <strong className="text-text-xl text-gray-900 font-bold">
            {title}
          </strong>
          <span className="text-text-xl font-bold">
            {amount.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-start items-center w-full">
          <span className="text-text-md text-gray-600">
            매월 {paymentDate}일에 지출
          </span>
        </div>

        <div className="flex justify-start items-center w-full">
          <span className="text-text-md text-extra">
            지난 {monthCount}개월 동안 고정 지출
          </span>
        </div>

        <div className="flex justify-end items-center gap-2">
          <button
            type="button"
            onClick={onRegister}
            className="w-24 px-[14px] py-2 rounded-lg text-text-md bg-[var(--color-brand-primary-500)] text-white cursor-pointer"
          >
            등록
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="w-24 px-[14px] py-2 rounded-lg text-text-md bg-gray-100 text-gray-900 cursor-pointer"
          >
            삭제
          </button>

        </div>
      </div>
    </li>
  );
};

export default FixedExpenseFound;
