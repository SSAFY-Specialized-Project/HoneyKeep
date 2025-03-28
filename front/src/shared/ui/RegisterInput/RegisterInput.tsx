import { useInputFocus } from "@/shared/hooks";

interface Props {
  errorMessage: string;
  valueFirst: string;
  valueSecond: string;
  onChangeFirst: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSecond: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref: React.Ref<HTMLInputElement>;
}

const RegisterInput = ({
  errorMessage,
  valueFirst,
  valueSecond,
  onChangeFirst,
  onChangeSecond,
  ref,
}: Props) => {
  const { isActive, inputRef } = useInputFocus();

  return (
    <div className="flex flex-col gap-1">
      <span className="text-text-sm text-warning font-normal">
        {errorMessage}
      </span>
      <div
        className={`w-full border-0 h-[4.375rem] px-4 pt-8 relative rounded-2xl
        ${isActive ? "bg-gray-50" : "bg-gray-100"}`}
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
              value={valueFirst}
              id={"registerFirst"}
              name={"register"}
              onChange={onChangeFirst}
              className={`cursor-pointer focus:outline-none z-10 w-36 font-semibold text-text-xl`}
              ref={inputRef}
            />
          </div>
          {isActive ? (
            <span className="text-text-xl font-semibold">-</span>
          ) : null}
          <div className=" font-semibold">
            <label htmlFor="registerSecond" className="sr-only">
              주민등록번호 뒤 1자리
            </label>
            <input
              type="text"
              value={valueSecond}
              id={"registerSecond"}
              name={"register"}
              onChange={onChangeSecond}
              className={`cursor-pointer focus:outline-none z-10 w-6 font-semibold text-text-xl`}
              ref={ref}
            />
            {isActive ? (
              <span className="text-title-sm leading-7.5 pr-4">
                * * * * * *
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterInput;
