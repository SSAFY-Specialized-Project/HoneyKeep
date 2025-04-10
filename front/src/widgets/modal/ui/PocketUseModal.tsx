import { deletePocketAPI } from '@/entities/pocket/api';
import { addCommas } from '@/shared/lib';
import { useBasicModalStore, useGatheringModalStore, usePocketUseModalStore } from '@/shared/store';
import { Icon, ModalOptionButton } from '@/shared/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

interface Props {
  isOpen: boolean;
  pocketId: number;
  accountId: number;
  pocketName: string;
  totalAmount: number;
  gatheredAmount: number;
}

const PocketUseModal = ({
  isOpen,
  pocketId,
  pocketName,
  totalAmount,
  gatheredAmount,
  accountId,
}: Props) => {
  const { closeModal: closeUseModal } = usePocketUseModalStore();
  const { openModal: openGatheringModal } = useGatheringModalStore();
  const { openModal: openBasicModal, closeModal: closeBasicModal } = useBasicModalStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleClose = () => {
    closeUseModal();
  };

  // 사용 완료
  const handleUseComplete = () => {};

  // 더 모으기
  const handleChargeMore = () => {
    openGatheringModal({
      pocketId,
      totalAmount,
      gatheredAmount,
    });
    closeUseModal();
  };

  // 삭제하기
  const deletePocketMutation = useMutation({
    mutationFn: (pocketId: number) => deletePocketAPI(pocketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pockets-info'] });
      queryClient.invalidateQueries({ queryKey: ['pocket-list-filter'] });
      closeBasicModal();
    },
    onError: () => {},
  });

  const handleDelete = () => {
    closeUseModal();
    openBasicModal({
      icon: 'exclamation-triangle',
      title: '포켓 삭제',
      itemName: pocketName.length > 10 ? pocketName.substring(0, 10) + '...' : pocketName,
      description: `포켓에 모은 ${addCommas(gatheredAmount)}원이 초기화해요.`,
      buttonText: '포켓 삭제',
      onConfirm: () => {
        deletePocketMutation.mutate(pocketId);
      },
    });
  };

  // 최근 거래 내역에서 사용하기
  const handleUseAtHistory = () => {
    navigate(`/pocket/use/${accountId}/${pocketId}`);
  };

  // 링크로 사용하기
  const handleUseWithLink = () => {};

  return (
    <div
      onClick={handleClose}
      className={`absolute top-0 left-0 z-50 flex h-full w-full flex-col justify-end overflow-hidden bg-gray-950/50 p-5 transition-opacity duration-200 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col items-end gap-3 bg-transparent"
      >
        <button
          type="button"
          onClick={handleClose}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white"
        >
          <Icon size="small" id="x-lg" />
        </button>
        <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-5">
          <ModalOptionButton text="더 모으기" icon="plus-circle-fill" onClick={handleChargeMore} />
          <ModalOptionButton text="삭제하기" icon="trash" onClick={handleDelete} />
        </div>
        <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-5">
          <ModalOptionButton text="사용 완료" icon="check-circle" onClick={handleUseComplete} />
          <ModalOptionButton
            text="최근 거래 내역에서 사용하기"
            icon="pocket"
            onClick={handleUseAtHistory}
          />
          <ModalOptionButton text="링크로 사용하기" icon="link-chain" onClick={handleUseWithLink} />
        </div>
      </div>
    </div>
  );
};

export default PocketUseModal;
