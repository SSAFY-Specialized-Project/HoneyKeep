import {
  deletePocketAPI,
  getPocketDetailAPI,
  patchPocketIsFavoriteAPI,
} from '@/entities/pocket/api';
import { ProductCard, ProgressBar } from '@/features/pocket/ui';
import { addCommas, extractDate } from '@/shared/lib';
import { useBasicModalStore, useGatheringModalStore, useHeaderStore } from '@/shared/store';
import { Icon } from '@/shared/ui';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router';

const PocketDetailPage = () => {
  const setContent = useHeaderStore((state) => state.setContent);
  const { openModal: openBasicModal, closeModal: closeBasicModal } = useBasicModalStore();

  // 삭제하기
  const deletePocketMutation = useMutation({
    mutationFn: (pocketId: number) => deletePocketAPI(pocketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pockets-info'] });
      closeBasicModal();
    },
    onError: () => {},
  });

  useEffect(() => {
    setContent(
      <button
        type="button"
        className="text-text-xl cursor-pointer font-semibold text-gray-600"
        onClick={handleDelete}
      >
        삭제하기
      </button>,
    );
  }, []);

  const param = useParams();
  const pocketId = param.id;
  const { openModal } = useGatheringModalStore();
  const queryClient = useQueryClient();

  const { data: pocketQuery } = useSuspenseQuery({
    queryKey: ['pocket-detail', pocketId],
    queryFn: async () => {
      if (!pocketId) {
        throw new Error('포켓 아이디가 없습니다.');
      }

      return getPocketDetailAPI(pocketId);
    },
  });

  const pocketFavoriteMutation = useMutation({
    mutationFn: patchPocketIsFavoriteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pocket-detail', pocketId] });
    },
  });

  useEffect(() => {
    console.log(pocketQuery.data);
  }, [pocketQuery]);

  if (!pocketId) {
    return;
  }

  const handleDelete = () => {
    openBasicModal({
      icon: 'exclamation-triangle',
      title: '포켓 삭제',
      itemName: pocketQuery.data.name,
      description: `포켓에 모은 ${addCommas(pocketQuery.data.savedAmount)}원이 초기화해요.`,
      buttonText: '포켓 삭제',
      onConfirm: () => {
        deletePocketMutation.mutate(Number(pocketId));
      },
    });
  };

  const handleIsFavorite = () => {
    pocketFavoriteMutation.mutate({
      pocketId: Number(pocketId),
      data: { isFavorite: !pocketQuery.data.isFavorite },
    });
  };

  const handleGatheringButton = () => {
    openModal({
      pocketId: Number(pocketId),
      totalAmount: pocketQuery.data.totalAmount,
      gatheredAmount: pocketQuery.data.savedAmount,
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-5">
      <div className="relative w-fit">
        <ProductCard
          productImage={pocketQuery.data.imgUrl}
          productName={pocketQuery.data.name}
          categoryName={pocketQuery.data.categoryName}
          productLink={pocketQuery.data.link}
        />
        <button className="absolute top-0 right-0 cursor-pointer" onClick={handleIsFavorite}>
          <Icon id={pocketQuery.data.isFavorite ? 'fill-star' : 'non-fill-star'} size="big" />
        </button>
      </div>
      <div className="w-full">
        <ProgressBar
          percentage={Math.round(
            (pocketQuery.data.savedAmount / pocketQuery.data.totalAmount) * 100,
          )}
          limitPercentage={
            Math.round((pocketQuery.data.savedAmount / pocketQuery.data.totalAmount) * 100) > 100
              ? 100
              : Math.round((pocketQuery.data.savedAmount / pocketQuery.data.totalAmount) * 100)
          }
          amountSaved={addCommas(pocketQuery.data.savedAmount)}
          goalAmount={addCommas(pocketQuery.data.totalAmount)}
          targetDate={extractDate(pocketQuery.data.endDate)}
          linkedAccount={pocketQuery.data.accountName}
          canEdit={true}
        />
      </div>
      <div className="mt-auto flex w-full gap-5">
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
