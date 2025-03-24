import { useInputFocus } from "@/shared/hooks";

interface Props {
  errorMessage?: string;
  id: string;
  name: string;
  label: string;
  value: string;
  type: React.HTMLInputTypeAttribute;
  buttonText?: string;
  disabled?: boolean;
  timer?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLDivElement>;
}

const BasicInput = ({
  errorMessage,
  id,
  name,
  label,
  value,
  type,
  buttonText,
  disabled,
  timer,
  onClick,
  onChange,
}: Props) => {
  const { isActive, inputRef } = useInputFocus();

  return (
    <div className="flex flex-col gap-1 relative">
      <span className="px-4 text-text-sm text-warning font-normal">
        {errorMessage}
      </span>
      <div
        className={`w-full border-0 h-[4.375rem] px-4 pt-8 relative rounded-2xl
        ${isActive ? "bg-gray-50" : "bg-gray-100"}`}
      >
        <label
          htmlFor={id}
          className={`absolute transition-all duration-300 ease-out z-10
          ${isActive ? "text-text-sm font-medium left-4 top-2" : "text-text-xl text-gray-400 font-semibold left-4 top-5"}`}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          id={id}
          name={name}
          onChange={onChange}
          placeholder={`${isActive ? `${label} 입력` : ""}`}
          className={`cursor-pointer focus:outline-none z-10 font-semibold text-text-xl
         `}
          ref={inputRef}
        />
        {timer ? (
          <span className="absolute right-32 top-1/2 -translate-y-1/2  font-semibold text-gray-500 text-text-xl">
            {timer}
          </span>
        ) : null}
        {onClick ? (
          <button
            type="button"
            disabled={disabled}
            className="absolute cursor-pointer right-6 top-1/2 disabled:bg-gray-100 disabled:text-gray-400 -translate-y-1/2 px-3 py-2 rounded-md font-semibold text-gray-900 bg-brand-primary-300 hover:bg-brand-primary-500"
          >
            {buttonText}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default BasicInput;
