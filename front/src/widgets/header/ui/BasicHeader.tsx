import { Icon } from '@/shared/ui';
import { AlarmModal } from '@/widgets/modal/ui';
import { useState } from 'react';
import { Link } from 'react-router';

const BasicHeader = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  return (
    <>
      <header className="shadow-header flex w-full items-center justify-end p-5">
        <div className="flex gap-5">
          <Link to="/chatbot">
            <Icon id={'chat-dots'} size="big" />
          </Link>
          <Link to="/qrPayment">
            <Icon id={'qr-code'} size="big" />
          </Link>
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
