import { Icon } from '@/shared/ui';
import React from 'react';

interface BasicModalProps {
  isOpen: boolean;
  icon?: string;
  title: string;
  itemName: string;
  description: string;
  buttonText: string;
  onClose?: (e: React.MouseEvent) => void;
  onConfirm?: (e: React.MouseEvent) => void;
}

const BasicModal: React.FC<BasicModalProps> = ({
  isOpen,
  icon,
  title,
  itemName,
  description,
  buttonText,
  onClose,
  onConfirm,
}) => {
  return (
    <div
      onClick={onClose}
      className={`absolute z-50 h-full w-full flex-col justify-end bg-gray-900/50 p-5 ${isOpen ? 'flex' : 'hidden'}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`flex w-full flex-col rounded-xl bg-white p-6 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'} `}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon ? (
              <div className="bg-brand-primary-300 rounded-lg">
                <Icon size="small" id={icon} />
              </div>
            ) : null}
            <h2 className="text-text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button className="p-1 text-gray-900 hover:opacity-70" onClick={onClose}>
            <Icon size="small" id="x-lg" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-text-sm text-left">
            <span className="font-bold text-gray-900">{itemName}</span>
            <span className="text-gray-600">{description}</span>
          </p>
        </div>
        <button
          className="bg-brand-primary-500 text-text-xl hover:bg-brand-primary-300 w-full rounded-xl py-4 font-bold text-white"
          onClick={onConfirm}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default BasicModal;
