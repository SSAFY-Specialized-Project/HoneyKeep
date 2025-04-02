type ProductCardProps = {
  productImage: string;
  productName: string;
  categoryName: string;
  productLink: string;
};

export default function ProductCard({
  productImage,
  productName,
  categoryName,
  productLink,
}: ProductCardProps) {
  return (
    <div className="flex w-[120px] flex-col items-center">
      {/* 이미지 + 회색 배경 영역 */}
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-100">
        <img src={productImage} alt={productName} className="h-[90px] w-[90px] object-contain" />
      </div>

      {/* 텍스트 영역 */}
      <div className="mt-2 text-center">
        <p className="text-sm font-semibold text-black">{productName}</p>
        <div className="mt-1 flex items-center justify-center space-x-1 text-xs">
          <span className="text-gray-400">{categoryName}</span>
          <a
            href={productLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            상품 페이지로 이동
          </a>
        </div>
      </div>
    </div>
  );
}
