import React from 'react';
import ErrorIcon from '/icon/error/Error.svg';

interface ErrorPageProps {
  title?: string;
  code?: string;
  description?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = '앗, 문제가 발생했어요',
  code = '404',
  description = '서비스 이용에 불편을 드려 죄송합니다.\n잠시 후 다시 시도해 주세요.',
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF3D1] px-6 text-center">
      <div className="mb-4 text-[#333]">
        <h1 className="text-2xl font-black">{title}</h1>
        <div className="mt-1 text-xl font-bold">{code}</div>
      </div>
      <img src={ErrorIcon} alt="에러 이미지" className="mb-6 h-auto w-[180px]" />
      <p className="text-medium leading-relaxed whitespace-pre-line text-gray-700">{description}</p>
      {/* 버튼은 여기에 추가 가능 */}
    </div>
  );
};

export default ErrorPage;
