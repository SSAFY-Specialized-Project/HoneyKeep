import { useInputFocus } from "@/shared/hooks";

interface Props {
  id: string;
  name: string;
  label: string;
  value: string;
  type: React.HTMLInputTypeAttribute;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  ref?: React.Ref<HTMLDivElement>;
}

const CalendarInput = ({ id, name, label, value, type, onChange }: Props) => {
  const { isActive, inputRef } = useInputFocus();

  return (
    <div
      className={`w-full border h-[4.375rem] px-4 pt-[2.25rem] relative rounded-2xl
        ${isActive ? "bg-white" : "bg-gray-100"}`}
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
        placeholder={`${isActive ? "이메일 입력" : ""}`}
        className={`cursor-pointer focus:outline-none z-10
         `}
        ref={inputRef}
      />
    </div>
  );
};

export default CalendarInput;
