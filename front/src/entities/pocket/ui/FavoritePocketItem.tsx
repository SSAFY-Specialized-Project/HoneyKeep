import usePocketCreateStore from '@/shared/store/usePocketCreateStore';
import { ImageContainer } from '@/shared/ui';

interface Props {
  name: string;
  imgUrl: string | null;
  totalAmount: number;
}

const FavoritePocketItem = ({ name, imgUrl, totalAmount }: Props) => {
  const { setName, setTotalAmount } = usePocketCreateStore();

  const handleFavorite = () => {
    setName(name);
    setTotalAmount(totalAmount);
  };

  return (
    <button
      onClick={handleFavorite}
      className="hover:bg-brand-primary-100 flex w-full cursor-pointer items-center justify-between px-4 py-5"
    >
      <div className="flex gap-3">
        <ImageContainer imgSrc={imgUrl} size="small" />
        <div className="flex flex-col">
          <span className="xs:text-text-lg text-text-md font-semibold text-gray-900">{name}</span>
          <span className="xs:text-text-sm text-text-xs text-gray-400">{}</span>
        </div>
      </div>
      <span className="xs:text-text-lg text-text-md font-semibold text-gray-900">
        {totalAmount}
      </span>
    </button>
  );
};

export default FavoritePocketItem;
