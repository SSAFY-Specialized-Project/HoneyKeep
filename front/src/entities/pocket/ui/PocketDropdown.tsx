import { Icon } from '@/shared/ui';
import { Pocket } from '../model/types';
import { useState } from 'react';

interface Props {
  pockets: Pocket[];
  value: string;
  setValue: (pocket: Pocket) => void;
}

const PocketDropdown = ({ pockets }: Props) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('없음');

  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <span className="text-text-sm font-bold text-white">{value}</span>
      </div>
    </div>
  );
};

export default PocketDropdown;
