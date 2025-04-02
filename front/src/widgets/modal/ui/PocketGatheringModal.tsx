import { Icon } from "@/shared/ui";
import React, { useState } from "react";

interface PocketGatheringModalProps {
  totalAmount: number;
  gatheredAmount: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: string) => void;
}

const PocketGatheringModal: React.FC<PocketGatheringModalProps> = ({
  totalAmount,
  gatheredAmount,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [amount, setAmount] = useState<string>("");

  if (!isOpen) return null;

  return (
    <>
      <div className="absolute bg-gray-900/50 w-full h-full" />
      <div className="absolute bg-white rounded-3xl p-6 z-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-title-md font-bold">
            {totalAmount.toLocaleString()}원 중{" "}
            {gatheredAmount.toLocaleString()}원 모았어요
          </h2>
          <button onClick={onClose} className="text-gray-900">
            <Icon size="small" id="x-lg" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 text-text-md">모을 금액</span>
            <div className="flex items-center">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="얼마를 더 모을까요?"
                className="w-full text-text-xl placeholder:text-gray-400"
              />
              <span className="text-text-xl">원</span>
            </div>
            <div className="h-[1px] w-full bg-gray-200" />
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-3 px-4 rounded-2xl bg-gray-100 text-text-md text-gray-900 hover:bg-gray-200">
              나중에 모으기
            </button>
            <button className="flex-1 py-3 px-4 rounded-2xl bg-gray-100 text-text-md text-[#2196f3] hover:bg-gray-200">
              전액 모으기
            </button>
          </div>

          <button
            onClick={() => onConfirm(amount)}
            className="w-full py-4 rounded-2xl bg-[#fa0] text-text-xl font-bold text-white hover:bg-[#c80]"
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
};

export default PocketGatheringModal;
