import { ImageContainer } from '@/shared/ui';
import { useNavigate } from 'react-router';

interface Props {
  id: number;
  name: string;
  imgUrl: string;
  totalAmount: number;
  endDate: string;
}

const PocketListItem = ({ id, name, imgUrl, totalAmount, endDate }: Props) => {
  const shortName = name.length > 15 ? name.substring(0, 16) + '...' : name;
  const navigate = useNavigate();

  return (
    <li className="flex justify-between">
      <div
        className="flex cursor-pointer gap-3"
        onClick={() => {
          navigate(`/pocket/detail/${id}`);
        }}
      >
        <ImageContainer imgSrc={imgUrl} size="small" />
        <div className="flex flex-col">
          <span className="text-text-md font-semibold text-gray-900">{shortName}</span>
          <div className="flex gap-1">
            <span className="text-text-sm text-gray-500">{endDate}</span>
            <span className="text-text-sm text-gray-900">{totalAmount}</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          // 포켓 관리 모달 오픈
        }}
      >
        관리
      </button>
    </li>
  );
};

export default PocketListItem;
