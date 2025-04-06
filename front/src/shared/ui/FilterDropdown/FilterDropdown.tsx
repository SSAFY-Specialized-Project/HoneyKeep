import { useState } from 'react';
import Icon from '../Icon/Icon';

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  value: string | null;
  children: React.ReactNode;
}

const FilterDropdown = ({ title, value, children, isOpen, setOpen }: Props) => {
  return (
    <div className="flex h-fit flex-col rounded-2xl bg-gray-100">
      <button
        type="button"
        onClick={() => {
          setOpen(!isOpen);
        }}
        className="flex cursor-pointer items-center gap-2 px-4 py-1.5"
      >
        <span className="text-text-lg font-bold text-gray-600">
          {value == null ? title : value}
        </span>
        <Icon isRotate={isOpen} size="small" id="chevron-down" />
      </button>
      {isOpen ? children : null}
    </div>
  );
};

export default FilterDropdown;
