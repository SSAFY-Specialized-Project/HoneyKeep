import React, { useState, useRef } from 'react';
import { PinVerification } from '@/entities/certification/model/types';

interface Props {
  accountNumber: string;
  onSubmit: (data: PinVerification) => void;
  isLoading?: boolean;
}

export const PinVerificationForm = ({ accountNumber, onSubmit, isLoading = false }: Props) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 입력된 PIN이 유효한지 확인
  const isPinValid = () => {
    return pin.every((digit) => digit.trim() !== '');
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPinValid()) {
      setError('4자리 PIN을 모두 입력해주세요.');
      return;
    }

    setError(null);
    onSubmit({
      accountNumber: accountNumber,
      pin: pin.join(''),
    });
  };

  // PIN 입력 핸들러
  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // 에러 초기화
    if (error) setError(null);

    // 다음 입력 필드로 이동
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 백스페이스 핸들러
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col justify-between">
      <div className="space-y-4">
        <h2 className="mb-4 text-center text-3xl font-bold">인증번호 4자리</h2>
        <p className="mb-10 text-center text-gray-500">SSAFY가 보낸 1원의 입금자명 뒤 4자리 숫자</p>

        {/* 기존 예시 텍스트는 주석 처리 또는 삭제 가능 */}
        {/* <div className="text-center text-gray-600 mb-4">
                    <p>예) SSAFY <span className="font-bold">1234</span></p>
                </div> */}

        <div className="my-12 flex justify-center space-x-4">
          {pin.map((digit, index) => (
            <div key={index} className="h-16 w-14 sm:h-20 sm:w-16">
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`h-full w-full rounded-xl border-2 text-center text-3xl font-semibold ${digit ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-gray-100'} transition-all duration-200 ease-in-out focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none`}
              />
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-center text-sm font-medium text-red-500">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading || !isPinValid()}
        className={`w-full cursor-pointer rounded-xl bg-yellow-400 py-4 font-bold text-white transition-all duration-200 ease-in-out hover:bg-yellow-500 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-70`}
      >
        {isLoading ? '확인 중...' : '확인'}
      </button>
    </form>
  );
};

export default PinVerificationForm;
