import Lottie from 'lottie-react';
import success from '@/assets/success.json';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigate import 경로 수정

type SuccessLocationState = {
    title?: string;
    description?: string;
    buttonText?: string;
}

export const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state as SuccessLocationState | null;

    const title = state?.title ?? "작업 완료!";
    const description = state?.description;
    const buttonText = state?.buttonText ?? "확인";

    const handleButtonClick = () => {
        navigate('/home');
    };

    return (
        <div className='flex flex-col items-center justify-center h-full p-6 text-center'>
            <Lottie
                animationData={success}
                loop={false}
                style={{ width: '160px', height: '160px', marginBottom: '1rem' }}
            />
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            {description && (
                <p className="text-gray-600 mb-6">{description}</p>
            )}
            <button
                onClick={handleButtonClick}
                className="w-full max-w-xs px-4 py-3 bg-brand-primary-500 text-white rounded-lg font-semibold hover:bg-brand-primary-600 transition-colors cursor-pointer"
            >
                {buttonText}
            </button>
        </div>
    );
};

export default SuccessPage;