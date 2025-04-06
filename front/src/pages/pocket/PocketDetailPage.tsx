import { getPocketDetailAPI } from '@/entities/pocket/api';
import { ProductCard, ProgressBar } from '@/features/pocket/ui';
import { addCommas } from '@/shared/lib';
import { useGatheringModalStore, useHeaderStore } from '@/shared/store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router';

const PocketDetailPage = () => {
  const setContent = useHeaderStore((state) => state.setContent);

  useEffect(() => {
    setContent(
      <button
        type="button"
        className="text-text-xl cursor-pointer font-semibold text-gray-600"
        onClick={() => {
          console.log('버튼 클릭!');
        }}
      >
        삭제하기
      </button>,
    );
  }, []);

  const param = useParams();
  const pocketId = param.id;
  const { openModal } = useGatheringModalStore();

  const { data: pocketQuery } = useSuspenseQuery({
    queryKey: ['pocket-detail', pocketId],
    queryFn: async () => {
      if (!pocketId) {
        throw new Error('포켓 아이디가 없습니다.');
      }

      return getPocketDetailAPI(pocketId);
    },
  });

  useEffect(() => {
    console.log(pocketQuery.data);
  }, [pocketQuery]);

  if (!pocketId) {
    return;
  }

  const handleGatheringButton = () => {
    openModal({
      pocketId: Number(pocketId),
      totalAmount: pocketQuery.data.totalAmount,
      gatheredAmount: pocketQuery.data.savedAmount,
    });
  };

  return (
    <div className="flex h-full flex-col gap-10 p-5">
      <div>
        <ProductCard
          productImage={pocketQuery.data.imgUrl}
          productName={pocketQuery.data.name}
          categoryName={pocketQuery.data.categoryName}
          productLink={pocketQuery.data.link}
        />
      </div>
      <div>
        <ProgressBar
          percentage={Math.round(
            (pocketQuery.data.savedAmount / pocketQuery.data.totalAmount) * 100,
          )}
          amountSaved={addCommas(pocketQuery.data.savedAmount)}
          goalAmount={addCommas(pocketQuery.data.totalAmount)}
          targetDate={pocketQuery.data.endDate}
          linkedAccount={pocketQuery.data.accountName}
          canEdit={true}
        />
      </div>
      <div className="mt-auto flex gap-5">
        <button
          type="button"
          onClick={handleGatheringButton}
          className="text-title-md w-full cursor-pointer rounded-2xl bg-gray-100 py-3 text-center font-bold text-gray-500"
        >
          더모으기
        </button>
        <button
          type="button"
          className="bg-brand-primary-500 text-title-md w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white"
        >
          사용하기
        </button>
      </div>
    </div>
  );
};

export default PocketDetailPage;
