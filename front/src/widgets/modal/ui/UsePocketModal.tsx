import { Link } from "react-router-dom";
import { Icon } from "@/shared/ui";

interface UsePocketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsePocketModal = ({ isOpen, onClose }: UsePocketModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="absolute bg-gray-900/50 w-full h-full z-50 top-0 left-0" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] bg-white rounded-3xl p-6 z-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-title-md font-bold">어떻게 사용할까요?</h2>
          <button onClick={onClose} className="text-gray-900 hover:opacity-70">
            <Icon size="small" id="x-lg" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            to="/share-link"
            className="flex items-center gap-1 p-1 text-gray-900 hover:bg-gray-50"
          >
            <Icon size="big" id="link-chain" />
            <span className="text-text-xl">링크로 사용하기</span>
          </Link>

          <Link
            to="/recent-transactions"
            className="flex items-center gap-1 p-1 text-gray-900 hover:bg-gray-50"
          >
            <Icon size="big" id="money-bag" />
            <span className="text-text-xl">최근 거래 내역에서 찾기</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default UsePocketModal;
