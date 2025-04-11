import { getPocketFilterList } from '@/entities/pocket/api';
import { PocketListItem } from '@/entities/pocket/ui';
import { CategoryFilterDropdown } from '@/features/category/ui';
import { StatusFilterDropdown } from '@/features/pocket/ui';
import { DateRangeFilterDropdown } from '@/entities/calendar/ui';
import { useHeaderStore } from '@/shared/store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

const PocketList = () => {
  const setTitle = useHeaderStore((state) => state.setTitle);

  useEffect(() => {
    setTitle('포켓 목록');
  }, []);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [status, setStatus] = useState<'사용중' | '사용전' | '사용완료' | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
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

  // Date 객체를 문자열로 변환하는 함수
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // DateRangeFilterDropdown에서 날짜가 선택되었을 때 호출되는 함수
  const handleDateRangeApply = (start: Date | null, end: Date | null) => {
    // Date 객체를 문자열로 변환하여 상태 업데이트
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));

    // 이제 문자열 형태의 날짜로 작업 수행
    console.log('선택된 시작일(문자열):', formatDate(start));
    console.log('선택된 종료일(문자열):', formatDate(end));
  };

  const { data: pocketListQuery } = useSuspenseQuery({
    queryKey: ['pocket-list-filter', categoryId, status, startDate, endDate, isFavorite],
    queryFn: () =>
      getPocketFilterList({
        categoryId,
        type: status == null ? null : statusMap[status],
        isFavorite,
        startDate,
        endDate,
      }),
    staleTime: 60 * 1000,
  });

  return (
    <div className="relative flex h-full flex-col gap-4 px-5">
      <div className="relative">
        <div className="xs:flex-nowrap absolute flex w-full flex-wrap gap-2">
          <div className="xs:w-auto w-[calc(50%-4px)]">
            <CategoryFilterDropdown setCategoryId={setCategoryId} />
          </div>
          <div className="xs:w-auto w-[calc(50%-4px)]">
            <StatusFilterDropdown status={status} setStatus={setStatus} />
          </div>
          <div className="xs:w-auto w-[calc(50%-4px)]">
            <DateRangeFilterDropdown onApply={handleDateRangeApply} />
          </div>
          <div className="xs:w-auto w-[calc(50%-4px)]">
            <button
              type="button"
              onClick={() => {
                setFavorite(!isFavorite);
              }}
              className={`flex h-fit w-full cursor-pointer items-center justify-center gap-0.5 rounded-2xl ${isFavorite ? 'bg-brand-primary-200' : 'bg-gray-100'} xs:px-3 xs:py-1.5 px-2 py-1`}
            >
              <span className="xs:text-text-lg text-text-md font-bold text-nowrap text-gray-600">
                즐겨찾기
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="xs:pt-10 h-full overflow-auto pt-24">
        <ul className="flex h-full flex-col gap-4">
          {pocketListQuery.data != null && pocketListQuery.data.length > 0 ? (
            pocketListQuery.data.map((item) => {
              return (
                <PocketListItem
                  id={item.id}
                  name={item.name}
                  imgUrl={item.imgUrl}
                  totalAmount={item.totalAmount}
                  savedAmount={item.savedAmount}
                  endDate={item.endDate}
                  type={item.type}
                />
              );
            })
          ) : (
            <li className="xs:text-text-lg text-text-md">만들어진 포켓이 없습니다.</li>
          )}
        </ul>
      </div>
      <Link
        to="/pocket/create"
        className="bg-brand-primary-500 text-title-md xs:text-title-lg mt-3 mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white"
      >
        포켓 만들기
      </Link>
    </div>
  );
};

export default PocketList;
