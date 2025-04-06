import { FilterDropdown } from '@/shared/ui';
import { useState } from 'react';

interface Props {
  duringDate: string | null;
  setDuringDate: React.Dispatch<React.SetStateAction<string | null>>;
}

const DuringDateDropdown = ({ duringDate, setDuringDate }: Props) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <FilterDropdown
      title="기간"
      value={duringDate}
      isOpen={isOpen}
      setOpen={setOpen}
      children={null}
    />
  );
};

export default DuringDateDropdown;
