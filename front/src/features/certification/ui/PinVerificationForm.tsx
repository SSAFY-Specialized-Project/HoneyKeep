import React, {useState, useRef} from 'react';
import {PinVerification} from '@/entities/certification/model/types';

interface Props {
    accountNumber: string;
    onSubmit: (data: PinVerification) => void;
    isLoading?: boolean;
}

export const PinVerificationForm = ({accountNumber, onSubmit, isLoading = false}: Props) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // 입력된 PIN이 유효한지 확인
    const isPinValid = () => {
        return pin.every(digit => digit.trim() !== '');
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
            pin: pin.join('')
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
        <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 h-full justify-between"
        >
            <div className="space-y-4">
                <h2 className="text-3xl font-bold mb-4 text-center">인증번호 4자리</h2>
                <p className="text-center text-gray-500 mb-10">SSAFY가 보낸 1원의 입금자명 뒤 4자리 숫자</p>
                
                {/* 기존 예시 텍스트는 주석 처리 또는 삭제 가능 */}
                {/* <div className="text-center text-gray-600 mb-4">
                    <p>예) SSAFY <span className="font-bold">1234</span></p>
                </div> */}
                
                <div className="flex justify-center space-x-4 my-12">
                    {pin.map((digit, index) => (
                        <div key={index} className="w-14 h-16 sm:w-16 sm:h-20">
                            <input
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text" 
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handlePinChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`w-full h-full text-center text-3xl font-semibold rounded-xl border-2 
                                          ${digit ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-gray-100'} 
                                          transition-all duration-200 ease-in-out 
                                          focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300`}
                            />
                        </div>
                    ))}
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center mt-4 font-medium">{error}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading || !isPinValid()}
                className={`w-full bg-yellow-400 text-white rounded-xl py-4 font-bold 
                          transition-all duration-200 ease-in-out 
                          hover:bg-yellow-500 hover:shadow-md 
                          disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70`}
            >
                {isLoading ? '확인 중...' : '확인'}
            </button>
        </form>
    );
};

export default PinVerificationForm;