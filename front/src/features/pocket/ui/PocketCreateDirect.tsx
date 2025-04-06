import { BorderInput } from '@/shared/ui';
import { useState } from 'react';

const PocketCreateDirect = () => {
  const [pocketName, setPocketName] = useState<string>('');
  const [pocketAmount, setPocketAmount] = useState<string>('');

  const handlePocketName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPocketName(e.currentTarget.value);
  };

  const handlePocketAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPocketAmount(e.currentTarget.value);
  };

  const handleCreatePocket = () => {
    console.log('click');
  };

  return (
    <div className="mt-8 flex h-full flex-col gap-4">
      <BorderInput
        type="text"
        label="pokcetName"
        labelText="포켓명"
        placeholder="예정된 지출명을 입력하세요."
        value={pocketName}
        onChange={handlePocketName}
      />
      <BorderInput
        type="text"
        label="amount"
        labelText="채울 금액"
        value={pocketAmount}
        onChange={handlePocketAmount}
        placeholder="지출 금액을 입력해주세요."
        content={<span className="text-title-sm absolute right-2.5 bottom-3">원</span>}
      />
      <button
        type="button"
        onClick={handleCreatePocket}
        className="bg-brand-primary-500 text-title-md mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-400"
      >
        생성하기
      </button>
    </div>
  );
};

export default PocketCreateDirect;
