import { useInputFocus } from '@/shared/hooks';

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
      className={`relative h-[4.375rem] w-full rounded-2xl border px-4 pt-[2.25rem] ${isActive ? 'bg-white' : 'bg-gray-100'}`}
    >
      <label
        htmlFor={id}
        className={`absolute z-10 transition-all duration-300 ease-out ${isActive ? 'text-text-sm top-2 left-4 font-medium' : 'text-text-xl top-5 left-4 font-semibold text-gray-400'}`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        id={id}
        name={name}
        onChange={onChange}
        placeholder={`${isActive ? '이메일 입력' : ''}`}
        className={`z-10 cursor-pointer focus:outline-none`}
        ref={inputRef}
      />
    </div>
  );
};

export default CalendarInput;
