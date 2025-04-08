import { Icon } from '@/shared/ui';
import { ReactNode } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const UpperBasicModal = ({ isOpen, onClose, children, title }: Props) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      className={`absolute top-0 left-0 z-50 flex h-full w-full flex-col justify-start overflow-hidden bg-gray-950/50 p-5 transition-opacity duration-200 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col items-end gap-3 bg-transparent"
      >
        <div
          className={`shadow-custom flex w-full flex-col gap-2 rounded-2xl bg-white p-5 transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex items-center justify-between">
            {title && <h2 className="text-text-lg font-semibold">{title}</h2>}
            <button
              type="button"
              onClick={handleClose}
              className="ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
            >
              <Icon size="small" id="x-lg" />
            </button>
          </div>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default UpperBasicModal;
