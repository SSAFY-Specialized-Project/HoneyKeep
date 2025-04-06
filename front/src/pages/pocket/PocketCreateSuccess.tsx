import { Player } from '@lottiefiles/react-lottie-player';
import successLottie from '@/assets/success.json';
import ProductCard from '@/features/pocket/ui/ProductCard';
import ProgressBar from '@/features/pocket/ui/ProgressBar';
import { useQueryClient } from '@tanstack/react-query';
import { PocketCreateResponse } from '@/entities/pocket/model/types';
import { useNavigate } from 'react-router';
import { addCommas } from '@/shared/lib';

const PocketCreateSuccess = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<PocketCreateResponse>(['pocket-create-direct']);

  if (!data) {
    navigate('/pocket/list');
    return;
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center px-4 py-6">
      {/* 오렌지색 라운드 애니메이션 */}
      <Player autoplay loop src={successLottie} style={{ height: '90px', width: '90px' }} />

      {/* 텍스트 */}
      <h2 className="mt-4 text-xl font-bold text-gray-800">포켓 만들기 성공!</h2>

      {/* 상품 카드 */}
      <ProductCard
        productImage={data.imgUrl}
        productName={data.name}
        categoryName={data.categoryName}
      />

      {/* 현황 ProgressBar */}
      <div className="mt-6 w-full">
        <ProgressBar
          percentage={Math.round((data.savedAmount / data.totalAmount) * 100)}
          amountSaved={addCommas(data.savedAmount)}
          goalAmount={addCommas(data.totalAmount)}
          targetDate={data.endDate}
          linkedAccount={data.accountName}
        />
      </div>
    </div>
  );
};

export default PocketCreateSuccess;
