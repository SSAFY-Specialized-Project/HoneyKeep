import { useGatheringModalStore, usePocketUseModalStore } from '@/shared/store';
import { Layout } from '@/shared/ui';
import { BasicHeader } from '@/widgets/header/ui';
import { PocketGatheringModal, PocketUseModal } from '@/widgets/modal/ui';
import { GlobalNavigation } from '@/widgets/navigation/ui';

const BaseLayout = () => {
  const { isOpen: pocketModalOpen, modalProps: pocketModalProps } = usePocketUseModalStore();
  const { isOpen: gatheringModalOpen, modalProps: gatheringModalProps } = useGatheringModalStore();
  return (
    <Layout
      headerSlot={<BasicHeader />}
      navbarSlot={<GlobalNavigation />}
      modalSlot={
        <>
          <PocketUseModal
            isOpen={pocketModalOpen}
            pocketId={pocketModalProps?.pocketId ?? 0}
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
