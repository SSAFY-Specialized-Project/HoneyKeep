import { Player } from '@lottiefiles/react-lottie-player';
import ProductCard from '@/features/pocket/ui/ProductCard';
import ProgressBar from '@/features/pocket/ui/ProgressBar';
import successLottie from '@/assets/success.json';

type Props = {
  title?: string;
  productImage: string;
  productName: string;
  categoryName: string;
  productLink: string;
  percentage: number;
  amountSaved: string;
  goalAmount: string;
  targetDate: string;
  linkedAccount: string;
};

export default function PocketSaveSuccess({
  title = '더모으기 성공!',
  productImage,
  productName,
  categoryName,
  productLink,
  percentage,
  amountSaved,
  goalAmount,
  targetDate,
  linkedAccount,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center px-4 py-6">
      {/* 애니메이션 */}
      <Player autoplay loop src={successLottie} style={{ height: '90px', width: '90px' }} />

      {/* 타이틀 */}
      <h2 className="mt-4 text-xl font-bold text-gray-800">{title}</h2>

      {/* 상품 카드 */}
      <div className="mt-6">
        <ProductCard
          productImage={productImage}
          productName={productName}
          categoryName={categoryName}
          productLink={productLink}
        />
      </div>

      {/* 진행 현황 */}
      <div className="mt-6 w-full">
        <ProgressBar
          percentage={percentage}
          amountSaved={amountSaved}
          goalAmount={goalAmount}
          targetDate={targetDate}
          linkedAccount={linkedAccount}
        />
      </div>
    </div>
  );
}
