import { Player } from '@lottiefiles/react-lottie-player';
import successLottie from '@/assets/success.json';
import ProductCard from '@/features/pocket/ui/ProductCard';
import ProgressBar from '@/features/pocket/ui/ProgressBar';
import { useQueryClient } from '@tanstack/react-query';
import { PocketCreateResponse } from '@/entities/pocket/model/types';
import { Link, useNavigate } from 'react-router';
import { addCommas, extractDate } from '@/shared/lib';

const PocketCreateSuccess = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<PocketCreateResponse>(['pocket-create-direct']);

  if (!data) {
    navigate('/pocket/list');
    return;
  }

  return (
    <div className="xs:gap-4 flex h-full w-full flex-col items-center gap-2 px-5">
      {/* 오렌지색 라운드 애니메이션 */}
      <Player autoplay src={successLottie} style={{ height: '90px', width: '90px' }} />

      {/* 텍스트 */}
      <h2 className="mt-4 text-xl font-bold text-gray-800">포켓 만들기 성공!</h2>

      {/* 상품 카드 */}
      <ProductCard
        categoryId={data.categoryId}
        productImage={data.imgUrl}
        productName={data.name}
        categoryName={data.categoryName}
      />

      {/* 현황 ProgressBar */}
      <div className="xs:mt-6 mt-4 w-full">
        <ProgressBar
          canEdit={false}
          percentage={Math.round((data.savedAmount / data.totalAmount) * 100)}
          limitPercentage={
            Math.round((data.savedAmount / data.totalAmount) * 100) > 100
              ? 100
              : Math.round((data.savedAmount / data.totalAmount) * 100)
          }
          amountSaved={addCommas(data.savedAmount)}
          goalAmount={addCommas(data.totalAmount)}
          targetDate={extractDate(data.endDate)}
          linkedAccount={data.accountName}
        />
      </div>

      <div className="mt-auto flex w-full justify-between gap-5">
        <Link
          to="/home"
          className="xs:text-title-md text-text-lg mt-auto w-full cursor-pointer rounded-2xl bg-gray-100 py-3 text-center font-bold text-gray-500 disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-400"
        >
          홈으로
        </Link>
        <Link
          to={`/pocket/detail/${data.id}`}
          className="bg-brand-primary-500 xs:text-title-md text-text-lg mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-400"
        >
          상세보기
        </Link>
      </div>
    </div>
  );
};

export default PocketCreateSuccess;
