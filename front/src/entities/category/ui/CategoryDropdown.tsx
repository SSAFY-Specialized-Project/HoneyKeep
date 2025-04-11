import { Pocket } from '@/entities/pocket/model/types';
import { PocketListItem } from '@/entities/pocket/ui';
import { formatWithKRW } from '@/shared/lib';
import { CategoryIcon, Icon } from '@/shared/ui';
import { useState } from 'react';
import { Link } from 'react-router';

interface Props {
  id: number;
  imageId: number;
  name: string;
  pocketCount: number;
  totalAmount: number;
  pocketList: Pocket[];
}

const CategoryDropdown = ({ id, imageId, name, pocketCount, totalAmount, pocketList }: Props) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <div className="shadow-custom xs:gap-2 xs:p-5 flex flex-col gap-1.5 rounded-2xl p-3">
      <button
        type="button"
        className="flex w-full cursor-pointer justify-between"
        onClick={() => {
          console.log('드롭다운 클릭!');
          setOpen(!isOpen);
        }}
      >
        <div className="xs:gap-2 flex items-center gap-1.5">
          <CategoryIcon size="small" category={imageId} />
          <div className="flex flex-col items-start justify-center">
            <span className="text-text-md xs:text-text-xl font-semibold text-gray-900">{name}</span>
            <div className="xs:gap-2 flex gap-1.5">
              <span className="text-text-xxs xs:text-text-sm text-gray-500">{`${pocketCount}개 항목`}</span>
              <span className="text-text-xxs xs:text-text-sm text-gray-900">
                {formatWithKRW(`${totalAmount}원`)}
              </span>
            </div>
          </div>
        </div>
        <div className={`flex items-center`}>
          <Icon id="chevron-down" size="small" isRotate={isOpen} />
        </div>
      </button>
      <ul
        className={`xs:gap-4 flex flex-col gap-2 overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? '' : 'hidden'} xs:mt-3 mt-1.5`}
      >
        {pocketList.map((item) => {
          return (
            <PocketListItem
              key={item.id}
              id={item.id}
              name={item.name}
              imgUrl={item.imgUrl}
              type={item.type}
              accountId={item.accountId}
              totalAmount={item.totalAmount}
              savedAmount={item.savedAmount}
              endDate={item.endDate}
            />
          );
        })}
        <Link
          to={`/pocket/list?category=${id}`}
          className="xs:py-2 text-text-xxs xs:text-text-sm block w-full py-1 text-center text-gray-600"
        >
          더 보기
        </Link>
      </ul>
    </div>
  );
};

export default CategoryDropdown;
