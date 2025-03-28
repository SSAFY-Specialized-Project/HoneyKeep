interface Props {
  count: number;
  totalAmount: number;
}

const FixedExpenseTotal = ({ count, totalAmount }: Props) => {
  return (
    <div className="w-full shadow-sm rounded-[1.25rem] bg-white">
      <div className="flex flex-col w-full p-[16px] gap-[8px]">
        <div className="flex justify-between items-center w-full gap-[4px]">
          <span className="text-[20px] text-gray-600 font-medium leading-[150%] font-pretendard">
            내 고정지출
          </span>
          <span className="text-[20px] text-black font-medium leading-[150%] font-pretendard">
            {count} 개
          </span>
        </div>

        <div className="flex justify-between items-center w-full gap-[4px]">
          <span className="text-[20px] text-gray-600 font-medium leading-[150%] font-pretendard">
            총 금액
          </span>
          <span className="text-[20px] text-black font-medium leading-[150%] font-pretendard">
            {totalAmount.toLocaleString()} 원
          </span>
        </div>
      </div>
    </div>
  );
};

export default FixedExpenseTotal;
