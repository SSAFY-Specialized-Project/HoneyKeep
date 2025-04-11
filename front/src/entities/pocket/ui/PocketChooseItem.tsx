import { addCommas } from '@/shared/lib';
import { usePocketChooseStore } from '@/shared/store';
import { ImageContainer } from '@/shared/ui';

interface Props {
  id: number;
  name: string;
  imgUrl: string | null;
  totalAmount: number;
  savedAmount: number;
}

const PocketChooseItem = ({ id, name, imgUrl, totalAmount, savedAmount }: Props) => {
  const { setPocketId, setPocketName, closeModal, setPocketAmount } = usePocketChooseStore();
  const handleChoose = () => {
    setPocketAmount(totalAmount);
    setPocketId(id);
    setPocketName(name);
    closeModal();
  };

  return (
    <button
      onClick={handleChoose}
      className="hover:bg-brand-primary-100 flex w-full cursor-pointer items-center justify-between px-4 py-5"
    >
      <div className="flex gap-3">
        <ImageContainer imgSrc={imgUrl} size="small" />
        <div className="flex flex-col">
          <span className="xs:text-text-lg text-text-md font-semibold text-gray-900">
            {name.length > 10 ? name.substring(0, 10) + '...' : name}
          </span>
          <span className="xs:text-text-sm text-text-xs text-gray-400">{}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex gap-2">
          <span className="xs:text-text-lg text-text-md font-semibold text-gray-900">총 금액</span>
          <span className="xs:text-text-lg text-text-md font-semibold text-gray-900">
            {addCommas(totalAmount)}원
          </span>
        </div>
        <div className="flex gap-2">
          <span className="xs:text-text-lg text-text-md font-semibold text-gray-900">
            모은 금액
          </span>
          <span className="xs:text-text-lg text-text-md font-semibold text-gray-900">
            {addCommas(savedAmount)}원
          </span>
        </div>
      </div>
    </button>
  );
};

export default PocketChooseItem;
