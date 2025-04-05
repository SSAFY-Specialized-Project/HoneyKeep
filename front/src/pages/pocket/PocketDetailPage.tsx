// import ProductCard from '@/features/pocket/ui/ProductCard';
// import ProgressBar from '@/features/pocket/ui/ProgressBar';
// import { Star } from 'lucide-react';

import { getPocketDetailAPI } from '@/entities/pocket/api';
import { useHeaderStore } from '@/shared/store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router';

// type Props = {
//   productImage: string;
//   productName: string;
//   categoryName: string;
//   productLink: string;
//   percentage: number;
//   amountSaved: string;
//   goalAmount: string;
//   targetDate: string;
//   linkedAccount: string;
// };

// export default function PocketDetail({
//   productImage,
//   productName,
//   categoryName,
//   productLink,
//   percentage,
//   amountSaved,
//   goalAmount,
//   targetDate,
//   linkedAccount,
// }: Props) {
//   return (
//     <div className="mx-auto w-full max-w-sm px-4 py-6">
//       {/* 상단 제목 + 삭제 */}
//       <div className="relative mb-4 text-center">
//         <h2 className="text-lg font-semibold">{productName}</h2>
//         <button className="absolute top-1/2 right-0 -translate-y-1/2 text-sm text-gray-400">
//           삭제하기
//         </button>
//       </div>

//       {/* 상품 카드 with 별 아이콘 */}
//       <div className="relative flex justify-center">
//         {/* 이미지와 아이콘을 기준 잡는 컨테이너 */}
//         <div className="relative">
//           <ProductCard
//             productImage={productImage}
//             productName={productName}
//             categoryName={categoryName}
//             productLink={productLink}
//           />
//           {/* 우측 상단 별 아이콘 */}
//           <div className="absolute top-2 right-2 rounded-full bg-white p-1 shadow">
//             <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
//           </div>
//         </div>
//       </div>

//       {/* 현황 ProgressBar */}
//       <div className="mt-6">
//         <ProgressBar
//           percentage={percentage}
//           amountSaved={amountSaved}
//           goalAmount={goalAmount}
//           targetDate={targetDate}
//           linkedAccount={linkedAccount}
//         />
//       </div>
//     </div>
//   );
// }

const PocketDetailPage = () => {
  const param = useParams();
  const setContent = useHeaderStore((state) => state.setContent);

  useEffect(() => {
    setContent(
      <button
        type="button"
        className="text-text-xl cursor-pointer font-semibold text-gray-600"
        onClick={() => {
          console.log('버튼 클릭!');
        }}
      >
        삭제하기
      </button>,
    );
  }, []);

  const pocketId = param.id;

  const { data: pocketQuery } = useSuspenseQuery({
    queryKey: ['pocket-detail', pocketId],
    queryFn: async () => {
      if (!pocketId) {
        throw new Error('포켓 아이디가 없습니다.');
      }

      return getPocketDetailAPI(pocketId);
    },
  });

  useEffect(() => {
    console.log(pocketQuery.data);
  }, [pocketQuery]);

  if (!pocketId) {
    return;
  }

  return <div></div>;
};

export default PocketDetailPage;
