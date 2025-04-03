import { Icon, ToggleButton } from '@/shared/ui';
import { useState } from 'react';

const PocketCreateStep = () => {
  const [isActive, setActive] = useState<boolean>(false);

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div>
        <div className="flex items-center gap-3">
          <Icon size="big" id="money-bag" />
          <h2 className="text-title-xl font-bold">포켓 만들기</h2>
        </div>
        <span className="text-title-sm text-gray-500">어떤 지출이 예정되어 있나요?</span>
      </div>
      <ToggleButton isActive={isActive} setActive={setActive} />
    </div>
  );
};

export default PocketCreateStep;
