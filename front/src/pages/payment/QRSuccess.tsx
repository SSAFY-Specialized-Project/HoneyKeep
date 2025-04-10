import { Player } from '@lottiefiles/react-lottie-player';
import successLottie from '@/assets/success.json';
import { Link, useNavigate } from 'react-router';
import useQRPayStore from '@/shared/store/useQRPayStore';
import { addCommas } from '@/shared/lib';

const QRSuccess = () => {
  const { productName, productAmount, accountName } = useQRPayStore();
  const navigate = useNavigate();

  if (productName == null || productAmount == null || accountName == null) {
    navigate('/home');
    return;
  }

  return (
    <div className="flex h-full flex-col items-center gap-10 px-5 pt-15">
      <Player autoplay loop src={successLottie} style={{ height: '90px', width: '90px' }} />
      <div className="flex flex-col items-center gap-2">
        <span className="text-title-lg font-bold">{productName}</span>
        <span className="text-title-md text-brand-primary-500 font-bold">
          {addCommas(productAmount)}원 결제 완료
        </span>
      </div>
      <div className="flex w-full flex-col gap-4 rounded-xl bg-gray-100 px-4 py-6">
        <div className="flex justify-between">
          <span className="">결제 수단</span>
          <span className="font-semibold">포켓 사용</span>
        </div>
        <div className="flex justify-between">
          <span className="">연동 계좌</span>
          <span className="font-semibold">{accountName}</span>
        </div>
      </div>
      <Link
        to="/home"
        className="bg-brand-primary-500 text-title-sm hover:bg-brand-primary-400 mt-auto w-full rounded-xl py-4 text-center text-base font-bold text-white"
      >
        홈으로
      </Link>
    </div>
  );
};

export default QRSuccess;
