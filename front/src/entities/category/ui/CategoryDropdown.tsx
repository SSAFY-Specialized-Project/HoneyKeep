import { Pocket } from '@/entities/pocket/model/types';
import { PocketListItem } from '@/entities/pocket/ui';
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
    <div className="shadow-custom flex flex-col gap-2 rounded-2xl p-5">
      <button
        type="button"
        className="flex w-full cursor-pointer justify-between"
        onClick={() => {
          console.log('드롭다운 클릭!');
          setOpen(!isOpen);
        }}
      >
        <div className="flex items-center gap-2.5">
          <CategoryIcon size="small" category={imageId} />
          <div className="flex flex-col items-start justify-center">
            <span className="text-text-xl font-semibold text-gray-900">{name}</span>
            <div className="flex gap-2">
              <span className="text-text-sm text-gray-500">{`${pocketCount}개 항목`}</span>
              <span className="text-text-sm text-gray-900">{`${totalAmount}원`}</span>
            </div>
          </div>
        </div>
        <div className={`flex items-center`}>
          <Icon id="chevron-down" size="small" isRotate={isOpen} />
        </div>
      </button>
      <ul
        className={`overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? '' : 'h-0'} `}
      >
        {pocketList.map((item) => {
          return (
            <PocketListItem
              key={item.id}
              name={item.name}
              imgUrl={item.imgUrl}
              totalAmount={item.totalAmount}
              endDate={item.endDate}
            />
          );
        })}
        <Link
          to={`/pocket/list?category=${id}`}
          className="block w-full py-2 text-center text-gray-600"
        >
          더 보기
        </Link>
      </ul>
    </div>
  );
};

export default CategoryDropdown;
