import React from "react";
import ErrorIcon from "/icon/error/Error.svg";

interface ErrorPageProps {
  title?: string;
  code?: string;
  description?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = "앗, 문제가 발생했어요",
  code = "404",
  description = "서비스 이용에 불편을 드려 죄송합니다.\n잠시 후 다시 시도해 주세요.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF3D1] text-center px-6">
      <div className="text-[#333] mb-4">
        <h1 className="text-2xl font-black">{title}</h1>
        <div className="text-xl font-bold mt-1">{code}</div>
      </div>
      <img
        src={ErrorIcon}
        alt="에러 이미지"
        className="w-[180px] h-auto mb-6"
      />
      <p className="text-gray-700 whitespace-pre-line text-medium leading-relaxed">
        {description}
      </p>
      {/* 버튼은 여기에 추가 가능 */}
    </div>
  );
};

export default ErrorPage;
