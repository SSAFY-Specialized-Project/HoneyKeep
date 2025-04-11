import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import successLottie from '@/assets/success.json'; // ✅ 애니메이션 JSON

type Props = {
  merchantName: string;
  amount: number;
  accountName: string;
};

export default function PaymentComplete({ merchantName, amount, accountName }: Props) {
  const navigate = useNavigate();
  const handleHome = () => navigate('/');

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-between bg-white px-4 py-6">
      {/* 상단 영역 */}
      <div>
        {/* ✅ Lottie 애니메이션 */}
        <div className="flex justify-center">
          <Player autoplay loop src={successLottie} style={{ height: '90px', width: '90px' }} />
        </div>

        {/* 텍스트 내용 */}
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-gray-900">{merchantName}</h2>
          <p className="text-brand-primary-500 mt-2 text-lg font-bold">
            {amount.toLocaleString()}원 결제 완료
          </p>
        </div>

        {/* 정보 박스 */}
        <div className="mt-8 divide-y divide-gray-100 rounded-xl bg-white text-sm text-gray-700 shadow">
          <div className="flex justify-between px-4 py-3">
            <span>결제수단</span>
            <span className="text-right font-medium text-gray-900">포켓 사용</span>
          </div>
          <div className="flex justify-between px-4 py-3">
            <span>연동 계좌</span>
            <span className="text-right font-medium text-gray-900">{accountName}</span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <button
        onClick={handleHome}
        className="bg-brand-primary-500 hover:bg-brand-primary-400 mt-6 w-full cursor-pointer rounded-xl py-4 text-base font-bold text-white"
      >
        홈으로
      </button>
    </div>
  );
}
