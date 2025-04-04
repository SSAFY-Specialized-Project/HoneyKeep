import { usePocketUseModalStore } from '@/shared/store';
import { Icon, ModalOptionButton } from '@/shared/ui';

// interface UsePocketModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const UsePocketModal = ({ isOpen, onClose }: UsePocketModalProps) => {
//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="absolute bg-gray-900/50 w-full h-full z-50 top-0 left-0" />
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] bg-white rounded-3xl p-6 z-50">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-title-md font-bold">어떻게 사용할까요?</h2>
//           <button onClick={onClose} className="text-gray-900 hover:opacity-70">
//             <Icon size="small" id="x-lg" />
//           </button>
//         </div>

//         <div className="flex flex-col gap-4">
//           <Link
//             to="/share-link"
//             className="flex items-center gap-1 p-1 text-gray-900 hover:bg-gray-50"
//           >
//             <Icon size="big" id="link-chain" />
//             <span className="text-text-xl">링크로 사용하기</span>
//           </Link>

//           <Link
//             to="/recent-transactions"
//             className="flex items-center gap-1 p-1 text-gray-900 hover:bg-gray-50"
//           >
//             <Icon size="big" id="money-bag" />
//             <span className="text-text-xl">최근 거래 내역에서 찾기</span>
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UsePocketModal;
interface Props {
  isOpen: boolean;
  pocketId: number;
}

const PocketUseModal = ({ isOpen, pocketId }: Props) => {
  const { closeModal } = usePocketUseModalStore();

  const handleClose = () => {
    closeModal();
  };

  // 사용 완료
  const handleUseComplete = () => {};

  // 더 모으기
  const handleChargeMore = () => {};

  // 삭제하기
  const handleDelete = () => {};

  // 최근 거래 내역에서 사용하기
  const handleUseAtHistory = () => {};

  // 링크로 사용하기
  const handleUseWithLink = () => {};

  return (
    <div
      onClick={handleClose}
      className={`absolute top-0 left-0 z-50 flex h-full w-full flex-col justify-end overflow-hidden bg-gray-950/50 p-5 transition-opacity duration-200 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col items-end gap-3 bg-transparent"
      >
        <button
          type="button"
          onClick={handleClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <Icon size="small" id="x-lg" />
        </button>
        <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-5">
          <ModalOptionButton text="더 모으기" icon="plus-circle-fill" onClick={handleChargeMore} />
          <ModalOptionButton text="삭제하기" icon="trash" onClick={handleDelete} />
        </div>
        <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-5">
          <ModalOptionButton text="사용 완료" icon="check-circle" onClick={handleUseComplete} />
          <ModalOptionButton
            text="최근 거래 내역에서 사용하기"
            icon="pocket"
            onClick={handleUseAtHistory}
          />
          <ModalOptionButton text="링크로 사용하기" icon="link-chain" onClick={handleUseWithLink} />
        </div>
      </div>
    </div>
  );
};

export default PocketUseModal;
