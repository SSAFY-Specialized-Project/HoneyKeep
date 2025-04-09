import { useBasicModalStore, useGatheringModalStore, usePocketUseModalStore } from '@/shared/store';
import { Layout } from '@/shared/ui';
import { BasicHeader } from '@/widgets/header/ui';
import { BasicModal, PocketGatheringModal, PocketUseModal } from '@/widgets/modal/ui';
import { GlobalNavigation } from '@/widgets/navigation/ui';

const BaseLayout = () => {
  const { isOpen: basicModalOpen, modalProps: basicModalProps } = useBasicModalStore();
  const { isOpen: pocketModalOpen, modalProps: pocketModalProps } = usePocketUseModalStore();
  const { isOpen: gatheringModalOpen, modalProps: gatheringModalProps } = useGatheringModalStore();
  return (
    <Layout
      headerSlot={<BasicHeader />}
      navbarSlot={<GlobalNavigation />}
      modalSlot={
        <>
          <BasicModal
            isOpen={basicModalOpen}
            icon={basicModalProps?.icon}
            title={basicModalProps?.title ?? ''}
            itemName={basicModalProps?.itemName ?? ''}
            description={basicModalProps?.description ?? ''}
            buttonText={basicModalProps?.buttonText ?? ''}
            onConfirm={basicModalProps?.onConfirm}
          ></BasicModal>
          <PocketUseModal
            isOpen={pocketModalOpen}
            pocketId={pocketModalProps?.pocketId ?? 0}
            pocketName={pocketModalProps?.pocketName ?? ''}
            totalAmount={pocketModalProps?.totalAmount ?? 0}
            gatheredAmount={pocketModalProps?.gatheredAmount ?? 0}
          />
          <PocketGatheringModal
            isOpen={gatheringModalOpen}
            pocketId={gatheringModalProps?.pocketId ?? 0}
            totalAmount={gatheringModalProps?.totalAmount ?? 0}
            gatheredAmount={gatheringModalProps?.gatheredAmount ?? 0}
          />
        </>
      }
    />
  );
};

export default BaseLayout;
