import { AgreementForm } from '@/features/mydata/ui';
import { useState } from 'react';
import { FOOTER_TEXT } from '@/features/mydata/model/constants.ts';
import { useNavigate } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ResponseDTO } from '@/shared/model/types.ts';
import { UserResponse } from '@/entities/user/model/types.ts';
import { getMeAPI } from '@/entities/user/api';

const AgreementWidget = () => {
  const [agreeEnabled, setAgreeEnabled] = useState(false);
  const navigate = useNavigate();

  // 로그인된 유저의 정보를 불러온다.
  const { data: me } = useSuspenseQuery<ResponseDTO<UserResponse>, Error, UserResponse>({
    queryKey: ['user-info'],
    queryFn: getMeAPI,
    select: (response) => response.data,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  const handleSubmit = () => {
    navigate('/mydata/certificates');
  };

  return (
    <div className="flex h-full flex-col">
      {/* 약관 부분 */}
      <div className="flex-1 overflow-y-auto">
        <AgreementForm userName={me.name} onAgreementChange={setAgreeEnabled} />
      </div>

      <div className="shadow-top sticky bottom-0 bg-white px-6 py-4">
        <div className="mb-6 text-xs text-gray-500">{FOOTER_TEXT}</div>

        {/* 버튼 */}
        <button
          className={`w-full cursor-pointer rounded-xl py-4 text-lg font-bold ${
            agreeEnabled
              ? 'bg-brand-primary-500 hover:bg-brand-primary-400 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}
          onClick={handleSubmit}
          disabled={!agreeEnabled}
        >
          동의하기
        </button>
      </div>
    </div>
  );
};

export default AgreementWidget;
