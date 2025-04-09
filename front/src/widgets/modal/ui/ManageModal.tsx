import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui';

interface ManageModalProps {
  onClose: () => void;
}

export const ManageModal = ({ onClose }: ManageModalProps) => {
  return (
    <>
      <div className="absolute z-50 h-full w-full bg-gray-900/50" />
      <div className="absolute right-0 bottom-0 left-0 z-50 flex flex-col items-end gap-2 p-4">
        <div className="rounded-full bg-white p-2">
          <button
            className="flex cursor-pointer items-center justify-center text-gray-900 hover:opacity-70"
            onClick={onClose}
          >
            <Icon size="small" id="x-lg" />
          </button>
        </div>

        <div className="w-full rounded-3xl bg-white p-4">
          <Link to="/add" className="flex items-center gap-1 p-1 text-gray-900 hover:bg-gray-50">
            <Icon size="big" id="plus-circle-fill" />
            <span className="text-text-sm">더 모으기</span>
          </Link>

          <Link to="/delete" className="flex items-center gap-1 p-1 text-gray-900 hover:bg-gray-50">
            <Icon size="big" id="exclamation-triangle" />
            <span className="text-text-sm">삭제하기</span>
          </Link>
        </div>

        <div className="w-full rounded-3xl bg-white p-4">
          <Link
            to="/recent-transactions"
            className="flex items-center gap-1 p-1 text-gray-900 hover:bg-gray-50"
          >
            <Icon size="big" id="money-bag" />
            <span className="text-text-sm">최근 거래 내역에서 사용하기</span>
          </Link>

          <Link
            to="/share-link"
            className="flex items-center gap-1 p-1 text-gray-900 hover:bg-gray-50"
          >
            <Icon size="big" id="link-chain" />
            <span className="text-text-sm">링크로 사용하기</span>
          </Link>
        </div>
      </div>
    </>
  );
};
