import { getCategoryWithPocket } from '@/entities/category/api';
import { CategoryWithPocket } from '@/entities/category/model/types';
import { CategoryDropdown } from '@/entities/category/ui';
import { ResponseDTO } from '@/shared/model/types';
import { ContentAddBox } from '@/shared/ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

const MyPocketInfo = () => {
  const navigate = useNavigate();

  const { data: pocketData } = useSuspenseQuery<ResponseDTO<CategoryWithPocket[]>>({
    queryKey: ['pockets-info'],
    queryFn: getCategoryWithPocket,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-text-lg xs:text-title-sm text-gray-900">내 포켓</h3>
      {pocketData.data != null ? (
        <ul className="xs:gap-3 flex flex-col gap-2">
          {pocketData.data.map((item) => {
            return (
              <CategoryDropdown
                key={item.categoryId}
                id={item.categoryId}
                imageId={item.icon}
                name={item.name}
                pocketCount={item.pockets.length}
                totalAmount={item.pockets.reduce((acc, pocket) => {
                  if (pocket.type == 'USED') return acc;
                  return acc + pocket.totalAmount;
                }, 0)}
                pocketList={item.pockets}
              />
            );
          })}
        </ul>
      ) : (
        <ContentAddBox
          text="포켓 추가하기"
          onClick={() => {
            navigate('/pocket/create');
          }}
        />
      )}
    </div>
  );
};

export default MyPocketInfo;
