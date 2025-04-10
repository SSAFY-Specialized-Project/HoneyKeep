import postPocketSurveyAPI from '@/entities/pocket/api/postPocketSurveyAPI';
import { Button, Checkbox } from '@/shared/ui';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

const PocketSurvey = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState<string>('');
  const { pocketId } = useParams();

  const options = [
    '예상보다 가격이 올랐어요',
    '갑작스러운 일이 생겼어요',
    '기분에 따라 충동적으로 썼어요',
    '계획이 너무 타이트했어요',
    '기타:',
  ];

  const surveyMutation = useMutation({
    mutationFn: postPocketSurveyAPI,
    onSuccess: () => {
      navigate('/qrSuccess');
    },
    onError: () => {
      navigate('-1');
    },
  });

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    console.log(selectedOption);
  };

  const handleConfirm = () => {
    surveyMutation.mutate({ pocketId: pocketId, data: { reasonText: selectedOption } });
  };

  return (
    <div className="mx-auto flex h-screen max-w-[600px] flex-col bg-white px-6 pt-6">
      {/* 메인 컨텐츠 */}
      <div className="flex h-full flex-grow flex-col items-center justify-center">
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
      <div className="mt-auto py-6">
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
