import getPocketFilterListAPI from '@/entities/pocket/api/getPocketFilterListAPI';
import { Pocket } from '@/entities/pocket/model/types';
import { ResponseDTO } from '@/shared/model/types';
import { useQuery } from '@tanstack/react-query';

const PocketFavoriteList = () => {
  // 즐겨찾기 받아오는 getQuery 필요

  const { data: pocketFavoriteData } = useQuery<ResponseDTO<Pocket[]>>({
    queryKey: ['pocket-favorite-list'],
    queryFn: async () => {
      return getPocketFilterListAPI({ isFavorite: true });
    },
    staleTime: 30 * 60 * 1000,
  });

  const handleGetFavorite = () => {};

  if (!pocketFavoriteData) return;

  return (
    <div className="flex h-full flex-col">
      <ul className="flex flex-col gap-4 overflow-auto">
        {pocketFavoriteData.data.map((item) => (
          <li key={item.id}></li>
        ))}
      </ul>
      <button
        type="button"
        disabled={false}
        onClick={handleGetFavorite}
        className="bg-brand-primary-500 text-title-md mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-400"
      >
        생성하기
      </button>
    </div>
  );
};

export default PocketFavoriteList;
