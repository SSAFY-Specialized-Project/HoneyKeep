import { MyAccountInfo } from '@/features/account/ui';
import { MyPocketInfo } from '@/features/pocket/ui';
import { Link } from 'react-router';
import UpperBasicModal from '@/widgets/modal/ui/AlarmModal';
import { useState } from 'react';

const Home = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 px-5 pt-5">
      <UpperBasicModal isOpen={isOpen} onClose={handleClose} title="포켓 금액 초과">
        <p>엄마 생신선물 포켓의 금액을 초과하여 지출했습니다.</p>
      </UpperBasicModal>
      <MyAccountInfo />
      <MyPocketInfo />
      <Link
        to="/pocket/create"
        className="bg-brand-primary-500 text-title-md mt-3 w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white"
      >
        포켓 만들기
      </Link>
      <button onClick={handleOpen} className="bg-brand-primary-500 rounded-lg p-2 text-white">
        모달 열기
      </button>
    </div>
  );
};

export default Home;
