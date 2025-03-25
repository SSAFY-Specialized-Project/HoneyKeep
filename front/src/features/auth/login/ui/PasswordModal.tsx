import { Dispatch, SetStateAction } from "react";

interface Props {
  isOpen: boolean;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const PasswordModal = ({ isOpen, value, setValue }: Props) => {
  const handleAddPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (value.length == 6) return;
    const num = e.currentTarget.dataset.value;
    setValue(value + num);
  };

  return (
    <div
      className={`absolute bg-white top-0 left-0 w-full h-full z-50 flex flex-col ${isOpen ? "block" : "hidden"} px-5 pt-15 pb-8 gap-8`}
    >
      <div className="w-full p-2.5 flex flex-col items-center gap-2.5">
        <h2 className="text-title-xl font-bold text-gray-900">비밀번호 인증</h2>
        <span className="text-title-sm font-semibold text-gray-600">
          비밀번호 6자리를 입력해주세요.
        </span>
      </div>
      <div className="w-full p-10 flex gap-2 justify-center">
        <span className="w-1/6 aspect-square flex items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(0, 1) ? "#" : "●"}
        </span>
        <span className="w-1/6 flex items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(1, 2) ? "#" : "●"}
        </span>
        <span className="w-1/6 flex items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(2, 3) ? "#" : "●"}
        </span>
        <span className="w-1/6 flex items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(3, 4) ? "#" : "●"}
        </span>
        <span className="w-1/6 flex items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(4, 5) ? "#" : "●"}
        </span>
        <span className="w-1/6 flex items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(5, 6) ? "#" : "●"}
        </span>
      </div>
      <div className="w-full h-full flex flex-col text-title-xl font-bold text-gray-900">
        <div className="w-full h-1/3 flex">
          <button
            onClick={handleAddPassword}
            data-value="1"
            className="w-1/3 h-full cursor-pointer"
          >
            1
          </button>
          <button
            onClick={handleAddPassword}
            data-value="2"
            className="w-1/3 h-full cursor-pointer"
          >
            2
          </button>
          <button
            onClick={handleAddPassword}
            data-value="3"
            className="w-1/3 h-full cursor-pointer"
          >
            3
          </button>
        </div>
        <div className="w-full h-1/3 flex">
          <button
            onClick={handleAddPassword}
            data-value="4"
            className="w-1/3 h-full cursor-pointer"
          >
            4
          </button>
          <button
            onClick={handleAddPassword}
            data-value="5"
            className="w-1/3 h-full cursor-pointer"
          >
            5
          </button>
          <button
            onClick={handleAddPassword}
            data-value="6"
            className="w-1/3 h-full cursor-pointer"
          >
            6
          </button>
        </div>
        <div className="w-full h-1/3 flex">
          <button
            onClick={handleAddPassword}
            data-value="7"
            className="w-1/3 h-full cursor-pointer"
          >
            7
          </button>
          <button
            onClick={handleAddPassword}
            data-value="8"
            className="w-1/3 h-full cursor-pointer"
          >
            8
          </button>
          <button
            onClick={handleAddPassword}
            data-value="9"
            className="w-1/3 h-full cursor-pointer"
          >
            9
          </button>
        </div>
        <div className="w-full h-1/3 flex">
          <button
            onClick={handleAddPassword}
            data-value="0"
            className="w-1/3 h-full ml-auto"
          >
            0
          </button>
          <button
            onClick={() => {
              setValue(value.slice(0, -1));
            }}
            className="w-1/3 h-full  cursor-pointer"
          >
            x
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
