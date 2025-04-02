import { Button, Checkbox } from "@/shared/ui";
import { Dispatch, SetStateAction } from "react";

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
      className={`absolute bg-gray-900/50 w-full h-full z-40 flex flex-col ${
        isOpen ? "block" : "hidden"
      } top-0 left-0`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col mt-auto bg-white p-6 rounded-t-3xl gap-5"
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
              className="w-6 h-6"
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
