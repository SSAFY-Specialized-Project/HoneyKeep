import usePocketCreateStore from '@/shared/store/usePocketCreateStore';
import { BorderInput } from '@/shared/ui';
import { useNavigate } from 'react-router';

const PocketCreateDirect = () => {
  const { name, setName, totalAmount, setTotalAmount } = usePocketCreateStore();
  const navigate = useNavigate();

  const handlePocketName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handlePocketAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.replace(/,/g, '');
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      setTotalAmount(numberValue);
    }
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleCreatePocket = () => {
    navigate('/pocket/create/direct/step');
  };

  return (
    <div className="mt-8 flex h-full flex-col gap-4">
      <BorderInput
        type="text"
        label="pokcetName"
        labelText="포켓명"
        placeholder="예정된 지출명을 입력하세요."
        value={name}
        onChange={handlePocketName}
      />
      <BorderInput
        type="text"
        label="amount"
        labelText="포켓 총 금액"
        value={formatNumber(totalAmount)}
        onChange={handlePocketAmount}
        placeholder="지출 금액을 입력해주세요."
        content={
          <span className="xs:text-title-sm text-text-lg absolute right-2.5 bottom-3 pl-2">원</span>
        }
      />
      <button
        type="button"
        onClick={handleCreatePocket}
        disabled={name == '' || totalAmount == 0}
        className="bg-brand-primary-500 text-text-xl xs:text-title-md mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-400"
      >
        다음으로
      </button>
    </div>
  );
};

export default PocketCreateDirect;
