import { useBasicModalStore } from '@/shared/store';
import { Layout } from '@/shared/ui';
import { HistoryHeader } from '@/widgets/header/ui';
import BasicModal from '@/widgets/modal/ui/BasicModal';

const HistoryLayout = () => {
  const { isOpen, modalProps } = useBasicModalStore();

  return (
    <Layout
      headerSlot={<HistoryHeader />}
      modalSlot={
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
      }
    />
  );
};

export default HistoryLayout;
