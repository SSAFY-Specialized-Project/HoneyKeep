import { useBasicModalStore, useGatheringModalStore, usePocketUseModalStore } from '@/shared/store';
import { Layout } from '@/shared/ui';
import { HistoryHeader } from '@/widgets/header/ui';
import { PocketGatheringModal, PocketUseModal } from '@/widgets/modal/ui';
import BasicModal from '@/widgets/modal/ui/BasicModal';

const HistoryLayout = () => {
  const { isOpen, modalProps } = useBasicModalStore();
  const { isOpen: pocketModalOpen, modalProps: pocketModalProps } = usePocketUseModalStore();
  const { isOpen: gatheringModalOpen, modalProps: gatheringModalProps } = useGatheringModalStore();

  return (
    <Layout
      headerSlot={<HistoryHeader />}
      modalSlot={
        <>
          <BasicModal
            icon={modalProps?.icon}
            isOpen={isOpen}
            title={modalProps?.title ?? ''}
            itemName={modalProps?.itemName ?? ''}
            description={modalProps?.description ?? ''}
            buttonText={modalProps?.buttonText ?? ''}
            onClose={modalProps?.onClose}
            onConfirm={modalProps?.onConfirm}
          />
          <PocketUseModal isOpen={pocketModalOpen} pocketId={pocketModalProps?.pocketId ?? 0} />
          <PocketGatheringModal
            isOpen={gatheringModalOpen}
            totalAmount={gatheringModalProps?.totalAmount ?? 0}
            gatheredAmount={gatheringModalProps?.gatheredAmount ?? 0}
            pocketId={gatheringModalProps?.pocketId ?? 0}
          />
        </>
      }
    />
  );
};

export default HistoryLayout;
