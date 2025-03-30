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
    <li className="list-none w-full shadow-custom rounded-[1.25rem]">
      <div className="flex flex-col w-full p-5 rounded-[1.25rem] gap-3">
        <div className="flex justify-between items-center w-full">
          <strong className="text-text-xl text-gray-900 font-bold">
            {title}
          </strong>
          <span className="text-text-xl font-bold">
            {amount.toLocaleString()} 원
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
            className={`w-24 px-[14px] py-2 rounded-lg text-text-md ${
              selectedAction === "register"
                ? "bg-[var(--color-brand-primary-600)] text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            등록
          </button>
          ㅗ
          <button
            type="button"
            onClick={onModify}
            className={`w-24 px-[14px] py-2 rounded-lg text-text-md ${
              selectedAction === "modify"
                ? "bg-[var(--color-brand-primary-600)] text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            수정
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={`w-24 px-[14px] py-2 rounded-lg text-text-md ${
              selectedAction === "delete"
                ? "bg-[var(--color-brand-primary-600)] text-white"
                : "bg-gray-100 text-gray-900"
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
