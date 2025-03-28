interface Props {
  title: string;
  paymentDate: string;
  amount: number;
  monthCount: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FixedExpenseInfo = ({
  title,
  paymentDate,
  amount,
  monthCount,
  onClick,
  onDelete,
}: Props) => {
  return (
    <li className="list-none w-full shadow-sm rounded-[1.25rem]">
      <button
        type="button"
        onClick={onClick}
        className="flex flex-col w-full p-[16px] rounded-[1.25rem] border-b border-gray-100 gap-[8px]"
      >
        <div className="flex justify-start items-center w-full gap-[4px]">
          <strong className="text-text-xl text-gray-900 font-bold">
            {title}
          </strong>
        </div>

        <div className="flex justify-between items-center w-full gap-[4px]">
          <span className="text-text-sm text-gray-600">
            매월 {paymentDate}일에 지출
          </span>
          <span className="text-text-xl font-bold">
            {amount.toLocaleString()} 원
          </span>
        </div>

        <div className="flex justify-between items-center w-full gap-[4px]">
          <span className="text-text-sm text-extra">
            지난 {monthCount}개월 동안 고정지출
          </span>
          <button
            type="button"
            onClick={onDelete}
            className="text-text-sm text-gray-600"
          >
            삭제
          </button>
        </div>
      </button>
    </li>
  );
};

export default FixedExpenseInfo;
