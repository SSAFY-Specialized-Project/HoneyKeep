import { Player } from '@lottiefiles/react-lottie-player';
import successLottie from '@/assets/success.json';
import ProductCard from '@/features/pocket/ui/ProductCard';
import ProgressBar from '@/features/pocket/ui/ProgressBar';

type Props = {
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

export default function PocketCreateSuccess({
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
      {/* 오렌지색 라운드 애니메이션 */}
      <Player autoplay loop src={successLottie} style={{ height: '90px', width: '90px' }} />

      {/* 텍스트 */}
      <h2 className="mt-4 text-xl font-bold text-gray-800">포켓 만들기 성공!</h2>

      {/* 상품 카드 */}
      <ProductCard
        productImage={productImage}
        productName={productName}
        categoryName={categoryName}
        productLink={productLink}
      />

      {/* 현황 ProgressBar */}
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
