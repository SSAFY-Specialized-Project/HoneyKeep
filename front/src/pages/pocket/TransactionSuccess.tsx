import successLottie from '@/assets/success.json';
import ProductCard from '@/features/pocket/ui/ProductCard';
import { Player } from '@lottiefiles/react-lottie-player';
import { useNavigate } from 'react-router-dom';
import { formatWithKRW } from '@/shared/lib';

type TransactionSuccessProps = {
  merchantName: string;
  amountUsed: number;
  productImage: string;
  productName: string;
  categoryName: string;
  productLink: string;
  totalSavedAmount: number;
  usedDate: string;
  accountName: string;
};

export default function TransactionSuccess({
  merchantName,
  amountUsed,
  productImage,
  productName,
  categoryName,
  productLink,
  totalSavedAmount,
  usedDate,
  accountName,
}: TransactionSuccessProps) {
  const navigate = useNavigate();
  const onConfirm = () => navigate('/');

  return (
    <div className="flex w-full max-w-sm flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-md">
      {/* 상단 콘텐츠 */}
      <div className="flex flex-col items-center">
        {/* 성공 애니메이션 */}
        <Player autoplay loop src={successLottie} style={{ height: '90px', width: '90px' }} />

        {/* 가맹점명 */}
        <h2 className="mt-2 text-xl font-bold">{merchantName}</h2>

        {/* 사용 금액 */}
        <p
          className="mt-1 text-lg font-semibold"
          style={{ color: 'var(--color-brand-primary-500)' }}
        >
          {amountUsed.toLocaleString()}원 사용 완료!
        </p>

        {/* 상품 정보 카드 */}
        <ProductCard
          productImage={productImage}
          productName={productName}
          categoryName={categoryName}
          productLink={productLink}
        />

        {/* 추가 정보 박스 - 스타일 변경 */}
        <div className="mt-6 w-full divide-y divide-gray-100 rounded-xl bg-white text-sm text-gray-800 shadow">
          <div className="flex justify-between px-4 py-3">
            <span className="font-medium">모은 금액</span>
            <span className="font-bold">{formatWithKRW(totalSavedAmount)}</span>
          </div>
          <div className="flex justify-between px-4 py-3">
            <span className="font-medium">지출 완료일</span>
            <span className="font-bold">{usedDate}</span>
          </div>
          <div className="flex justify-between px-4 py-3">
            <span className="font-medium">연동 계좌</span>
            <span className="font-bold">{accountName}</span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <button
        className="bg-brand-primary-500 hover:bg-brand-primary-300 mt-2 w-full cursor-pointer rounded-xl py-4 text-base font-bold text-white"
        onClick={onConfirm}
      >
        홈으로
      </button>
    </div>
  );
}
