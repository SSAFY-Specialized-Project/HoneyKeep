import { usePocketUseModalStore } from '@/shared/store';
import { Layout } from '@/shared/ui';
import { BasicHeader } from '@/widgets/header/ui';
import { PocketUseModal } from '@/widgets/modal/ui';
import { GlobalNavigation } from '@/widgets/navigation/ui';

const BaseLayout = () => {
  const { isOpen: pocketModalOpen, modalProps: pocketModalProps } = usePocketUseModalStore();
  return (
    <Layout
      headerSlot={<BasicHeader />}
      navbarSlot={<GlobalNavigation />}
      modalSlot={
        <PocketUseModal isOpen={pocketModalOpen} pocketId={pocketModalProps?.pocketId ?? 0} />
      }
    />
  );
};

export default BaseLayout;
