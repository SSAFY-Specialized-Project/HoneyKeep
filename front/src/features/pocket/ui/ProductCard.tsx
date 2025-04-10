import { CategoryIcon, ImageContainer } from '@/shared/ui';

type ProductCardProps = {
  productImage: string | null;
  productName: string;
  categoryId: number;
  categoryName: string;
  productLink?: string;
};

export default function ProductCard({
  productImage,
  productName,
  categoryId,
  categoryName,
  productLink,
}: ProductCardProps) {
  const shortProductName =
    productName.length > 15 ? productName.substring(0, 16) + '...' : productName;

  return (
    <div className="flex flex-col items-center gap-4">
      {productImage != null ? (
        <ImageContainer size="big" imgSrc={productImage} />
      ) : (
        <CategoryIcon category={categoryId} size="semiBig" />
      )}

      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-2 text-center">
        <p className="text-text-lg font-semibold text-gray-900">{shortProductName}</p>
        <div className="flex items-center justify-center space-x-1 text-xs">
          <span className="border-r border-r-gray-400 px-1 text-gray-400">{categoryName}</span>
          {productLink != null ? (
            <a
              href={productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              상품 페이지로 이동
            </a>
          ) : (
            <a
              href={productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:underline"
            >
              링크 없음
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
