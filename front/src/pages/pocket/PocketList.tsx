import { getPocketFilterList } from '@/entities/pocket/api';
import { PocketFilterResponse } from '@/entities/pocket/model/types';
import { PocketListItem } from '@/entities/pocket/ui';
import { CategoryFilterDropdown } from '@/features/category/ui';
import { DuringDateDropdown, StatusFilterDropdown } from '@/features/pocket/ui';
import { useHeaderStore } from '@/shared/store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const PocketList = () => {
  const setTitle = useHeaderStore((state) => state.setTitle);

  useEffect(() => {
    setTitle('포켓 목록');
  }, []);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [status, setStatus] = useState<'사용중' | '사용전' | '사용완료' | null>(null);
  const [duringDate, setDuringDate] = useState<string | null>(null);
  const [isFavorite, setFavorite] = useState<boolean>(false);

  const statusMap: {
    사용중: 'USING';
    사용전: 'UNUSED';
    사용완료: 'USED';
  } = {
    사용중: 'USING',
    사용전: 'UNUSED',
    사용완료: 'USED',
  };

  const { data: pocketListQuery } = useSuspenseQuery({
    queryKey: ['pocket-list-filter', categoryId, status, duringDate, isFavorite],
    queryFn: () =>
      getPocketFilterList({
        categoryId,
        type: status == null ? null : statusMap[status],
        isFavorite,
      }),
    staleTime: 30 * 1000 * 60,
  });

  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="flex gap-4">
        <CategoryFilterDropdown setCategoryId={setCategoryId} />
        <StatusFilterDropdown status={status} setStatus={setStatus} />
        <DuringDateDropdown duringDate={duringDate} setDuringDate={setDuringDate} />
        <button
          type="button"
          onClick={() => {
            setFavorite(!isFavorite);
          }}
          className={`flex h-fit cursor-pointer items-center gap-2 rounded-2xl ${isFavorite ? 'bg-brand-primary-200' : 'bg-gray-100'} px-4 py-1.5`}
        >
          <span className="text-text-lg font-bold text-gray-600">즐겨찾기</span>
        </button>
      </div>
      <div className="mt-6">
        <ul className="flex flex-col gap-4">
          {pocketListQuery.data
            ? pocketListQuery.data.map((item) => {
                return (
                  <PocketListItem
                    id={item.id}
                    name={item.name}
                    imgUrl={item.imgUrl}
                    totalAmount={item.totalAmount}
                    endDate={item.endDate}
                    type={item.type}
                  />
                );
              })
            : null}
        </ul>
      </div>
    </div>
  );
};

export default PocketList;
