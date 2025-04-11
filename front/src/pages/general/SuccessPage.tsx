import Lottie from 'lottie-react';
import success from '@/assets/success.json';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigate import 경로 수정

type SuccessLocationState = {
  title?: string;
  description?: string;
  buttonText?: string;
};

export const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as SuccessLocationState | null;

  const title = state?.title ?? '작업 완료!';
  const description = state?.description;
  const buttonText = state?.buttonText ?? '확인';

  const handleButtonClick = () => {
    navigate('/home');
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <Lottie
        animationData={success}
        loop={false}
        style={{ width: '160px', height: '160px', marginBottom: '1rem' }}
      />
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      {description && <p className="mb-6 text-gray-600">{description}</p>}
      <button
        onClick={handleButtonClick}
        className="bg-brand-primary-500 hover:bg-brand-primary-600 w-full max-w-xs cursor-pointer rounded-lg px-4 py-3 font-semibold text-white transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default SuccessPage;
