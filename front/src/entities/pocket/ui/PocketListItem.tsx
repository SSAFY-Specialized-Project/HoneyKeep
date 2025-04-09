import { addCommas, calculateDDay } from '@/shared/lib';
import { usePocketUseModalStore } from '@/shared/store';
import { Icon, ImageContainer } from '@/shared/ui';
import { useNavigate } from 'react-router';

interface Props {
  id: number;
  name: string;
  imgUrl: string;
  totalAmount: number;
  savedAmount: number;
  endDate: string;
  type: 'UNUSED' | 'USING' | 'USED';
}

const PocketListItem = ({ id, name, imgUrl, totalAmount, savedAmount, endDate, type }: Props) => {
  const navigate = useNavigate();
  const { openModal } = usePocketUseModalStore();

  const shortName = name.length > 15 ? name.substring(0, 16) + '...' : name;

  const pocketType = {
    UNUSED: '사용전',
    USING: '사용중',
    USED: '사용완료',
  };

  const STYLE_TYPE = {
    UNUSED: 'text-white bg-brand-primary-500',
    USING: 'text-white bg-accept',
    USED: 'text-gray-900 bg-gray-100',
  };

  return (
    <li className="flex justify-between">
      <div
        className="flex cursor-pointer items-center gap-3"
        onClick={() => {
          navigate(`/pocket/detail/${id}`);
        }}
      >
        <ImageContainer imgSrc={imgUrl} size="small" />
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="text-text-md font-semibold text-gray-900">{shortName}</span>
            <span>{calculateDDay(endDate)}</span>
          </div>
          <div className="flex gap-1">
            <div
              className={`text-text-sm h-5.5 w-15 ${STYLE_TYPE[type]} flex items-center justify-center rounded-md text-center`}
            >
              <span className={`font-bold`}>{pocketType[type]}</span>
            </div>
            <span className="text-text-sm text-gray-900">{addCommas(totalAmount)}원</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="justify-content flex h-6 w-6 cursor-pointer items-center"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          // 포켓 관리 모달 오픈
          openModal({ pocketId: id, totalAmount, gatheredAmount: savedAmount, pocketName: name });
        }}
      >
        <Icon size="small" id="three-dots-vertical" />
      </button>
    </li>
  );
};

export default PocketListItem;
