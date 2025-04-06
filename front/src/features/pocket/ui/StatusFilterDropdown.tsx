import { FilterDropdown } from '@/shared/ui';
import { useState } from 'react';

interface Props {
  status: string | null;
  setStatus: React.Dispatch<React.SetStateAction<'사용중' | '사용전' | '사용완료' | null>>;
}

const StatusFilterDropdown = ({ status, setStatus }: Props) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const handleStatusFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.dataset.value) return;

    setStatus(e.currentTarget.dataset.value as '사용중' | '사용전' | '사용완료' | null);
    setOpen(false);
  };

  const statusList = (
    <ul>
      <li>
        <button
          type="button"
          className="text-text-lg cursor-pointer px-4 py-1.5 font-bold text-gray-600"
          data-value="사용전"
          onClick={handleStatusFilter}
        >
          사용전
        </button>
      </li>
      <li>
        <button
          type="button"
          className="text-text-lg cursor-pointer px-4 py-1.5 font-bold text-gray-600"
          data-value="사용중"
          onClick={handleStatusFilter}
        >
          사용중
        </button>
      </li>
      <li>
        <button
          type="button"
          className="text-text-lg cursor-pointer px-4 py-1.5 font-bold text-gray-600"
          data-value="사용완료"
          onClick={handleStatusFilter}
        >
          사용완료
        </button>
      </li>
    </ul>
  );

  return (
    <FilterDropdown
      title="상태"
      value={status}
      children={statusList}
      isOpen={isOpen}
      setOpen={setOpen}
    />
  );
};

export default StatusFilterDropdown;
