interface Props {
  title: string;
  paymentDate: string;
  amount: number;
  monthCount: number;
  selectedAction: "register" | "modify" | "delete" | null;
  onRegister: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onModify: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FixedExpenseFound = ({
  title,
  paymentDate,
  amount,
  monthCount,
  selectedAction,
  onRegister,
  onModify,
  onDelete,
}: Props) => {
  return (
    <li className="list-none w-full shadow-sm rounded-[1.25rem]">
      <div className="flex flex-col w-full p-[16px] rounded-[1.25rem] border-b border-gray-100 gap-[8px]">
        <div className="flex justify-between items-center w-full gap-[4px]">
          <strong className="text-text-xl text-gray-900 font-bold">
            {title}
          </strong>
          <span className="text-text-xl font-bold">
            {amount.toLocaleString()} 원
          </span>
        </div>

        <div className="flex justify-start items-center w-full gap-[4px]">
          <span className="text-text-sm text-gray-600">
            매월 {paymentDate}일에 지출
          </span>
        </div>

        <div className="flex justify-start items-center w-full gap-[4px]">
          <span className="text-text-sm text-blue-600">
            지난 {monthCount}개월 동안 고정 지출
          </span>
        </div>

        <div className="flex justify-end items-center gap-[8px]">
          <button
            type="button"
            onClick={onRegister}
            className={`flex w-[81px] px-[14px] py-[8px] justify-center items-center gap-[10px] rounded-[8px] ${
              selectedAction === "register"
                ? "bg-[#FFAA00] text-white"
                : "bg-[#F5F5F5] text-gray-900"
            }`}
          >
            등록
          </button>
          <button
            type="button"
            onClick={onModify}
            className={`flex w-[81px] px-[14px] py-[8px] justify-center items-center gap-[10px] rounded-[8px] ${
              selectedAction === "modify"
                ? "bg-[#FFAA00] text-white"
                : "bg-[#F5F5F5] text-gray-900"
            }`}
          >
            수정
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={`flex w-[81px] px-[14px] py-[8px] justify-center items-center gap-[10px] rounded-[8px] ${
              selectedAction === "delete"
                ? "bg-[#FFAA00] text-white"
                : "bg-[#F5F5F5] text-gray-900"
            }`}
          >
            삭제
          </button>
        </div>
      </div>
    </li>
  );
};

export default FixedExpenseFound;
