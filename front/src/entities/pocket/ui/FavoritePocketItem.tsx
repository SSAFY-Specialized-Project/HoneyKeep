import { CategoryIcon } from '@/shared/ui';

interface Props {
  name: string;
  startDate: string;
  endDate: string;
  accountId: number;
  categoryId: number;
  categoryName: string;
  totalAmount: number;
  savedAmount: number;
}

const FavoritePocketItem = ({
  name,
  startDate,
  endDate,
  accountId,
  categoryId,
  categoryName,
  totalAmount,
  savedAmount,
}: Props) => {
  const handleFavorite = () => {};

  return (
    <button onClick={handleFavorite} className="flex items-center justify-between">
      <div className="flex gap-3">
        <CategoryIcon size="small" category={categoryId} />
        <div>
          <span>{name}</span>
          <span>{categoryName}</span>
        </div>
      </div>
      <span>{totalAmount}</span>
    </button>
  );
};

export default FavoritePocketItem;
