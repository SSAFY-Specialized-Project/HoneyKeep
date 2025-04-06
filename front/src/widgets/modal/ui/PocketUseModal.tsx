import { deletePocketAPI } from '@/entities/pocket/api';
import { useGatheringModalStore, usePocketUseModalStore } from '@/shared/store';
import { Icon, ModalOptionButton } from '@/shared/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  isOpen: boolean;
  pocketId: number;
  totalAmount: number;
  gatheredAmount: number;
}

const PocketUseModal = ({ isOpen, pocketId, totalAmount, gatheredAmount }: Props) => {
  const { closeModal: closeUseModal } = usePocketUseModalStore();
  const { openModal: openGatheringModal } = useGatheringModalStore();
  const queryClient = useQueryClient();

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
      closeUseModal();
      console.log('포켓 삭제 성공');
    },
    onError: () => {},
  });

  const handleDelete = () => {
    deletePocketMutation.mutate(pocketId);
  };

  // 최근 거래 내역에서 사용하기
  const handleUseAtHistory = () => {};

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
