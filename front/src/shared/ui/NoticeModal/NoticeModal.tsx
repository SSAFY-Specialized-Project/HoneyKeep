import { useNoticeModalStore } from '@/shared/store';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
}

const NoticeModal = ({ isOpen }: Props) => {
  const { setClose } = useNoticeModalStore();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, setClose]);

  return (
    <div
      className={`
        fixed top-16 left-1/2 -translate-x-1/2 
        z-50 flex items-center gap-3
        bg-gradient-to-r bg-gray-100
        text-gray-600 
        px-4 py-6 rounded-xl shadow-2xl 
        backdrop-blur-sm
        transition-all duration-300 ease-in-out
        transform-gpu
        ${isOpen 
          ? 'visible opacity-100 translate-y-0 scale-100' 
          : 'invisible opacity-0 -translate-y-8 scale-95 pointer-events-none'}
      `}
      role="alert"
    >
      <div className="flex items-center justify-center rounded-full text-brand-primary-500">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"/>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-lg">링크로 포켓 생성 완료!</span>
      </div>
    </div>
  );
};

export default NoticeModal;
