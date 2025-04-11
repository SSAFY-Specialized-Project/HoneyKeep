import { Button, Checkbox } from '@/shared/ui';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AccountLinkModal = ({ isOpen, setIsOpen }: Props) => {
  return (
    <div
      onClick={() => {
        setIsOpen(false);
      }}
      className={`absolute z-40 flex h-full w-full flex-col bg-gray-900/50 ${
        isOpen ? 'block' : 'hidden'
      } top-0 left-0`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="mt-auto flex flex-col gap-5 rounded-t-3xl bg-white p-6"
      >
        <div className="flex items-center gap-4">
          <Checkbox
            text="개인정보 보호 동의"
            isChecked={false}
            onChange={() => {}}
            onClick={() => {}}
          />
          <button className="ml-auto">
            <svg
              className="h-6 w-6 cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <Button
          text="동의하고 진행하기"
          onClick={() => {
            setIsOpen(false);
          }}
          disabled={false}
          className="text-white"
        />
      </div>
    </div>
  );
};

export default AccountLinkModal;
