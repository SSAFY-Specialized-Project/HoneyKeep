interface Props {
  title: string;
  paymentDate: string;
  amount: number;
  monthCount: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onModify: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FixedExpenseInfo = ({
  title,
  paymentDate,
  amount,
  monthCount,
  onClick,
  onModify,
  onDelete,
}: Props) => {
  return (
    <li className="list-none w-full shadow-custom rounded-[1.25rem]">
      <button
        type="button"
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
            {amount.toLocaleString()} 원
          </span>
        </div>

        <div className="flex justify-between items-center w-full">
          <span className="text-text-md text-extra">
            지난 {monthCount}개월 동안 고정지출
          </span>
          <div className="flex gap-6">
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
        </div>
      </button>
    </li>
  );
};

export default FixedExpenseInfo;
