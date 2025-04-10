import { useBasicModalStore, useGatheringModalStore, usePocketUseModalStore } from '@/shared/store';
import { Layout } from '@/shared/ui';
import { HistoryHeader } from '@/widgets/header/ui';
import { PocketGatheringModal, PocketUseModal } from '@/widgets/modal/ui';
import BasicModal from '@/widgets/modal/ui/BasicModal';
import { GlobalNavigation } from '@/widgets/navigation/ui';

const HistoryNavLayout = () => {
  const { isOpen, modalProps } = useBasicModalStore();
  const { isOpen: pocketModalOpen, modalProps: pocketModalProps } = usePocketUseModalStore();
  const { isOpen: gatheringModalOpen, modalProps: gatheringModalProps } = useGatheringModalStore();

  return (
    <Layout
      headerSlot={<HistoryHeader />}
      navbarSlot={<GlobalNavigation />}
      modalSlot={
        <>
          <BasicModal
            icon={modalProps?.icon}
            isOpen={isOpen}
            title={modalProps?.title ?? ''}
            itemName={modalProps?.itemName ?? ''}
            description={modalProps?.description ?? ''}
            buttonText={modalProps?.buttonText ?? ''}
            onConfirm={modalProps?.onConfirm}
          />
          <PocketUseModal
            isOpen={pocketModalOpen}
            accountId={pocketModalProps?.accountId ?? 0}
            pocketId={pocketModalProps?.pocketId ?? 0}
            pocketName={pocketModalProps?.pocketName ?? ''}
            totalAmount={pocketModalProps?.totalAmount ?? 0}
            gatheredAmount={pocketModalProps?.gatheredAmount ?? 0}
          />
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

export default HistoryNavLayout;
