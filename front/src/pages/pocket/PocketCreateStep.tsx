import { AccountInputDropdown } from '@/entities/account/ui';
import CategoryInputDropDown from '@/entities/category/ui/CategoryInputDropDown';
import { BorderInput, Icon, ToggleButton } from '@/shared/ui';
import { useState } from 'react';

const PocketCreateStep = () => {
  const [isActive, setActive] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [chargeAmount, setChargeAmount] = useState<string>('');

  const [accountId, setAccountId] = useState<number | null>(null);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.currentTarget.value);
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.currentTarget.value);
  };

  const handleChargeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]+$/;

    const newValue = e.currentTarget.value;

    // 비어있거나 숫자로만 구성된 경우에만 값을 업데이트
    if (newValue === '' || regex.test(newValue)) {
      setChargeAmount(newValue);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div>
        <div className="flex items-center gap-3">
          <Icon size="big" id="money-bag" />
          <h2 className="text-title-xl font-bold">포켓 만들기</h2>
        </div>
        <span className="text-title-sm text-gray-500">어떤 지출이 예정되어 있나요?</span>
      </div>
      <div className="text-text-md flex items-center gap-3 font-bold text-gray-700">
        <span>지출 예정일</span>
        <ToggleButton isActive={isActive} setActive={setActive} />
      </div>
      <div className={`w-full justify-between gap-15 ${isActive ? 'flex' : 'hidden'}`}>
        <BorderInput
          type="date"
          label="startDate"
          labelText="시작일"
          value={startDate}
          onChange={handleStartDate}
        />
        <BorderInput
          type="date"
          label="endDate"
          labelText="끝일"
          value={endDate}
          onChange={handleEndDate}
        />
      </div>
      <AccountInputDropdown
        accountId={accountId}
        setAccountId={setAccountId}
        setAccountBalance={setAccountBalance}
      />
      <CategoryInputDropDown />
      <div className="flex flex-col gap-3">
        <BorderInput
          type="text"
          label="amount"
          labelText="채울 금액"
          value={chargeAmount}
          onChange={handleChargeAmount}
          placeholder="0"
          content={<span className="text-title-sm absolute right-2.5 bottom-3">원</span>}
        />
        {accountBalance != null && accountBalance < Number(chargeAmount) ? (
          <span className="text-text-sm text-warning font-bold">
            계좌 잔액이 포켓 금액보다 적어 비활성화 상태로 생성됩니다.
          </span>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {}}
              className="text-extra text-text-sm h-9 w-25 rounded-sm bg-gray-100 text-center font-semibold"
            >
              나중에 채우기
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="text-extra text-text-sm h-9 w-25 rounded-sm bg-gray-100 text-center font-semibold"
            >
              전액 채우기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PocketCreateStep;
