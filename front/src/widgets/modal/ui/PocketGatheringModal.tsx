import { patchPocketGather } from '@/entities/pocket/api';
import { addCommas, formatCurrency } from '@/shared/lib';
import { useGatheringModalStore } from '@/shared/store';
import { Icon } from '@/shared/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface Props {
  isOpen: boolean;
  pocketId: number;
  totalAmount: number;
  gatheredAmount: number;
}

const PocketGatheringModal = ({ isOpen, totalAmount, gatheredAmount, pocketId }: Props) => {
  const navigate = useNavigate();
  const closeModal = useGatheringModalStore((state) => state.closeModal);
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<string>('');

  const gatheringPocketMutation = useMutation({
    mutationFn: patchPocketGather,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['pocket-detail', String(pocketId)] });
      setAmount('0');
      closeModal();

      navigate(`/pocket/detail/${pocketId}`);
    },
    onError: () => {
      console.log('에러입니다.');
    },
  });

  if (!isOpen) return null;

  const handlePatchGathering = () => {
    console.log('클릭!');
    gatheringPocketMutation.mutate({ data: { savedAmount: { amount: Number(amount) } }, pocketId });
  };

  const handleGatherAll = () => {
    setAmount(String(totalAmount - gatheredAmount));
  };

  return (
    <div
      onClick={closeModal}
      className={`absolute z-50 h-full w-full flex-col justify-end bg-gray-900/50 p-5 ${isOpen ? 'flex' : 'hidden'}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`flex w-full flex-col rounded-xl bg-white p-6 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'} `}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-title-sm font-bold">
            {addCommas(totalAmount)}원 중 {addCommas(gatheredAmount)}원 모았어요
          </h2>
          <button onClick={closeModal} className="cursor-pointer text-gray-900">
            <Icon size="small" id="x-lg" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-text-md text-gray-500">모을 금액</span>
            <div className="flex items-center">
              <input
                type="text"
                value={formatCurrency(amount)}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="얼마를 더 모을까요?"
                className="text-text-xl w-full placeholder:text-gray-400"
              />
              <span className="text-text-xl">원</span>
            </div>
            <div className="h-[1px] w-full bg-gray-200" />
          </div>

          <div className="flex gap-2">
            <button className="text-text-md cursor-pointer rounded-2xl bg-gray-100 px-4 py-3 text-gray-900 hover:bg-gray-200">
              나중에 모으기
            </button>
            <button
              className="text-text-md cursor-pointer rounded-2xl bg-gray-100 px-4 py-3 text-[#2196f3] hover:bg-gray-200"
              onClick={handleGatherAll}
            >
              전액 모으기
            </button>
          </div>

          <button
            onClick={handlePatchGathering}
            className="text-text-xl w-full cursor-pointer rounded-2xl bg-[#fa0] py-4 font-bold text-white hover:bg-[#c80]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default PocketGatheringModal;
