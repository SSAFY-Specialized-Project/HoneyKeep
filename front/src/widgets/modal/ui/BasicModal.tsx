import { Icon } from "@/shared/ui";
import React from "react";

interface BasicModalProps {
  title: string;
  itemName: string;
  description: string;
  buttonText: string;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const BasicModal: React.FC<BasicModalProps> = ({
  title,
  itemName,
  description,
  buttonText,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="absolute bg-gray-900/50 z-50 h-full w-full">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-custom">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-brand-primary-300 rounded-lg">
              <Icon size="small" id="exclamation-triangle" />
            </div>
            <h2 className="text-text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            className="text-gray-900 p-1 hover:opacity-70"
            onClick={onClose}
          >
            <Icon size="small" id="x-lg" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-left text-text-sm">
            <span className="font-bold text-gray-900">{itemName}</span>
            <span className="text-gray-600">{description}</span>
          </p>
        </div>
        <button
          className="w-full bg-brand-primary-500 text-white rounded-xl py-4 font-bold text-text-xl hover:bg-brand-primary-300"
          onClick={onConfirm}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default BasicModal;
