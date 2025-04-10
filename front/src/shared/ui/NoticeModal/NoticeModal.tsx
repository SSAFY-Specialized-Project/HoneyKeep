import { useNoticeModalStore } from '@/shared/store';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
}

const NoticeModal = ({ isOpen }: Props) => {
  const { setClose } = useNoticeModalStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setClose();
      }, 3000);
    }
  }, [isOpen, setClose]);

  return (
    <div
      className={`absolute top-5 left-1/2 -translate-x-1/2 bg-gray-200 px-5 py-3 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      <span>링크로 포켓 생성 완료!</span>
    </div>
  );
};

export default NoticeModal;
