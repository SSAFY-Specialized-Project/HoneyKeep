import { useInputFocus } from "@/shared/hooks";

interface Props {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  ref: React.Ref<HTMLInputElement>;
}

const RegisterInput = ({ value, onChange, ref }: Props) => {
  const { isActive, inputRef } = useInputFocus();

  return (
    <div
      className={`w-full border h-[4.375rem] px-4 pt-[2.25rem] relative rounded-2xl
        ${isActive ? "bg-white" : "bg-gray-100"}`}
    >
      <span
        className={`absolute transition-all duration-300 ease-out z-10
          ${isActive ? "text-text-sm font-medium left-4 top-2" : "text-text-xl text-gray-400 font-semibold left-4 top-5"}`}
      >
        {"주민등록번호 7자리"}
      </span>
      <div className="flex justify-between">
        <div>
          <label htmlFor="registerFirst" className="sr-only">
            주민등록번호 앞 6자리
          </label>
          <input
            type="text"
            value={value}
            id={"registerFirst"}
            name={"register"}
            onChange={onChange}
            className={`cursor-pointer focus:outline-none z-10 w-36`}
            ref={inputRef}
          />
        </div>
        {isActive ? (
          <span className="text-text-xl font-semibold">-</span>
        ) : null}
        <div className="text-text-lg font-semibold">
          <label htmlFor="registerSecond" className="sr-only">
            주민등록번호 뒤 1자리
          </label>
          <input
            type="text"
            value={value}
            id={"registerSecond"}
            name={"register"}
            onChange={onChange}
            className={`cursor-pointer focus:outline-none z-10 w-6`}
            ref={ref}
          />
          {isActive ? <span className="text-text-xl">* * * * * *</span> : null}
        </div>
      </div>
    </div>
  );
};

export default RegisterInput;
