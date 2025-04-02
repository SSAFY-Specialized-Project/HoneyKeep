type ProgressBarProps = {
  percentage: number; // 저장된 퍼센트 (0~100)
  amountSaved: string; // 현재까지 모은 금액
  goalAmount: string; // 목표 금액
  targetDate?: string; // 목표일 (선택)
  linkedAccount?: string; // 연동 계좌 정보 (선택)
};

export default function ProgressBar({
  percentage,
  amountSaved,
  goalAmount,
  targetDate,
  linkedAccount,
}: ProgressBarProps) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-white shadow-md">
      {/* 상단: 퍼센트 + 현재 금액 */}
      <div className="mb-3 flex items-end justify-between px-4 pt-4">
        <div className="text-brand-primary-500 text-3xl leading-none font-bold">{percentage}%</div>
        <div className="text-right">
          <div className="text-xs text-gray-700">현재 금액</div>
          <div className="text-base font-bold text-gray-700">{amountSaved}</div>
        </div>
      </div>

      {/* 진행 바 */}
      <div className="mb-3 px-4">
        <div className="bg-brand-primary-100 h-1.5 w-full rounded">
          <div
            className="bg-brand-primary-500 h-full rounded transition-all duration-500 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 추가 정보 행 */}
      <div className="divide-y divide-gray-100 text-sm text-gray-800">
        <div className="flex justify-between px-4 py-3">
          <span className="font-medium">포켓 금액</span>
          <span className="font-bold">{goalAmount}</span>
        </div>
        <div className="flex justify-between px-4 py-3">
          <span className="font-medium">지출 예정일</span>
          <span className="font-bold">{targetDate || '-'}</span>
        </div>
        <div className="flex justify-between px-4 py-3">
          <span className="font-medium">연동 계좌</span>
          <span className="font-bold">{linkedAccount || '-'}</span>
        </div>
      </div>
    </div>
  );
}
