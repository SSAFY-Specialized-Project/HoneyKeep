import { BorderInput, Icon, ToggleButton } from '@/shared/ui';
import { useState } from 'react';

const PocketCreateStep = () => {
  const [isActive, setActive] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.currentTarget.value);
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.currentTarget.value);
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
    </div>
  );
};

export default PocketCreateStep;
