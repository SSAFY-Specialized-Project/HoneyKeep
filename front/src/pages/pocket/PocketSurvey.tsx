import { Button, Checkbox } from '@/shared/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const PocketSurvey = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState<string>('');

  const options = [
    '예상보다 가격이 올랐어요',
    '갑작스러운 일이 생겼어요',
    '기분에 따라 충동적으로 썼어요',
    '계획이 너무 타이트했어요',
    '기타:',
  ];

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 pt-6">
      {/* 메인 컨텐츠 */}
      <div className="flex flex-grow flex-col">
        <h1 className="text-title-lg mb-4 font-bold">이번 포켓, 왜 초과하셨나요?</h1>
        <p className="text-text-md mb-8 text-gray-600">
          다음에 더 좋은 계획을 세우기 위한 회고 단계에요
        </p>

        {/* 옵션 체크리스트 */}
        <div className="mb-8 flex flex-col gap-4">
          {options.map((option) => (
            <div key={option}>
              <Checkbox
                text={option}
                isChecked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
                size="big"
              />
              {option === '기타:' && selectedOption === '기타:' && (
                <input
                  type="text"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="이유를 입력해주세요"
                  className="focus:border-brand-primary-500 mt-2 ml-8 w-[80%] border-b border-gray-300 p-2 focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 확인 버튼 */}
      <div className="py-6">
        <Button
          text="확인"
          disabled={!selectedOption}
          onClick={handleConfirm}
          className="bg-brand-primary-500 text-white"
        />
      </div>
    </div>
  );
};

export default PocketSurvey;
