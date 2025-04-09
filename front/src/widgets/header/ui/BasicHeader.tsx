import { Icon } from '@/shared/ui';
import { AlarmModal } from '@/widgets/modal/ui';
import { useState } from 'react';

const BasicHeader = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  return (
    <>
      <header className="shadow-header flex w-full items-center justify-end p-5">
        <div className="flex gap-5">
          <Icon id={'qr-code'} size="big" />
          <button onClick={handleOpenModal} className="cursor-pointer">
            <Icon id={'alarm'} size="big" />
          </button>
        </div>
      </header>
      <AlarmModal isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};

export default BasicHeader;
