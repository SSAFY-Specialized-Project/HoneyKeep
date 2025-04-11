import { Dispatch, SetStateAction } from 'react';

interface Props {
  isOpen: boolean;
  passwordCheck: boolean;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const PasswordModal = ({ isOpen, value, passwordCheck, setValue }: Props) => {
  const handleAddPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (value.length == 6) return;
    const num = e.currentTarget.dataset.value;
    setValue(value + num);
  };

  return (
    <div
      className={`absolute top-0 left-0 z-50 flex h-full w-full flex-col bg-white ${isOpen ? 'block' : 'hidden'} gap-8 px-5 pt-15 pb-8`}
    >
      <div className="flex w-full flex-col items-center gap-2.5 p-2.5">
        <h2 className="text-title-xl font-bold text-gray-900">비밀번호 인증</h2>
        <span
          className={`text-title-sm font-semibold ${passwordCheck ? 'text-gray-600' : 'text-warning'}`}
        >
          {passwordCheck ? '비밀번호 6자리를 입력해주세요.' : '비밀번호가 틀렸습니다.'}
        </span>
      </div>
      <div className="flex w-full justify-center gap-2 p-10">
        <span className="flex aspect-square w-1/6 items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(0, 1) ? (
            <img src="/icon/assets/Vector.svg" width={20} height={20} alt="비밀번호 입력됨" />
          ) : (
            '●'
          )}
        </span>
        <span className="flex w-1/6 items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(1, 2) ? (
            <img src="/icon/assets/Vector.svg" width={20} height={20} alt="비밀번호 입력됨" />
          ) : (
            '●'
          )}
        </span>
        <span className="flex w-1/6 items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(2, 3) ? (
            <img src="/icon/assets/Vector.svg" width={20} height={20} alt="비밀번호 입력됨" />
          ) : (
            '●'
          )}
        </span>
        <span className="flex w-1/6 items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(3, 4) ? (
            <img src="/icon/assets/Vector.svg" width={20} height={20} alt="비밀번호 입력됨" />
          ) : (
            '●'
          )}
        </span>
        <span className="flex w-1/6 items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(4, 5) ? (
            <img src="/icon/assets/Vector.svg" width={20} height={20} alt="비밀번호 입력됨" />
          ) : (
            '●'
          )}
        </span>
        <span className="flex w-1/6 items-center justify-center rounded-2xl bg-gray-200">
          {value.slice(5, 6) ? (
            <img src="/icon/assets/Vector.svg" width={20} height={20} alt="비밀번호 입력됨" />
          ) : (
            '●'
          )}
        </span>
      </div>
      <div className="text-title-xl flex h-full w-full flex-col font-bold text-gray-900">
        <div className="flex h-1/3 w-full">
          <button
            onClick={handleAddPassword}
            data-value="1"
            className="h-full w-1/3 cursor-pointer"
          >
            1
          </button>
          <button
            onClick={handleAddPassword}
            data-value="2"
            className="h-full w-1/3 cursor-pointer"
          >
            2
          </button>
          <button
            onClick={handleAddPassword}
            data-value="3"
            className="h-full w-1/3 cursor-pointer"
          >
            3
          </button>
        </div>
        <div className="flex h-1/3 w-full">
          <button
            onClick={handleAddPassword}
            data-value="4"
            className="h-full w-1/3 cursor-pointer"
          >
            4
          </button>
          <button
            onClick={handleAddPassword}
            data-value="5"
            className="h-full w-1/3 cursor-pointer"
          >
            5
          </button>
          <button
            onClick={handleAddPassword}
            data-value="6"
            className="h-full w-1/3 cursor-pointer"
          >
            6
          </button>
        </div>
        <div className="flex h-1/3 w-full">
          <button
            onClick={handleAddPassword}
            data-value="7"
            className="h-full w-1/3 cursor-pointer"
          >
            7
          </button>
          <button
            onClick={handleAddPassword}
            data-value="8"
            className="h-full w-1/3 cursor-pointer"
          >
            8
          </button>
          <button
            onClick={handleAddPassword}
            data-value="9"
            className="h-full w-1/3 cursor-pointer"
          >
            9
          </button>
        </div>
        <div className="flex h-1/3 w-full">
          <button onClick={handleAddPassword} data-value="0" className="ml-auto h-full w-1/3">
            0
          </button>
          <button
            onClick={() => {
              setValue(value.slice(0, -1));
            }}
            className="h-full w-1/3 cursor-pointer"
          >
            x
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
