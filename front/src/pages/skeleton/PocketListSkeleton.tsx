const PocketListSkeleton = () => {
  return (
    <div className="relative flex h-full flex-col gap-4 px-5">
      {/* 필터 부분 스켈레톤 */}
      <div className="relative">
        <div className="absolute flex gap-4">
          {/* 카테고리 필터 스켈레톤 */}
          <div className="flex h-fit animate-pulse flex-col rounded-2xl bg-gray-100">
            <div className="flex items-center gap-2 px-4 py-1.5">
              <div className="h-5 w-20 rounded-md bg-gray-200"></div>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-200"></div>
            </div>
          </div>

          {/* 상태 필터 스켈레톤 */}
          <div className="flex h-fit animate-pulse flex-col rounded-2xl bg-gray-100">
            <div className="flex items-center gap-2 px-4 py-1.5">
              <div className="h-5 w-16 rounded-md bg-gray-200"></div>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-200"></div>
            </div>
          </div>

          {/* 날짜 범위 필터 스켈레톤 */}
          <div className="relative animate-pulse">
            <div className="flex items-center justify-between gap-2 rounded-full bg-gray-100 px-4 py-1.5">
              <div className="h-5 w-24 rounded-md bg-gray-200"></div>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-200"></div>
            </div>
          </div>

          {/* 즐겨찾기 필터 스켈레톤 */}
          <div className="flex h-fit animate-pulse items-center gap-2 rounded-2xl bg-gray-100 px-4 py-1.5">
            <div className="h-5 w-20 rounded-md bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* 제품 목록 스켈레톤 */}
      <div className="mt-12 h-full">
        <ul className="flex h-full flex-col gap-4 overflow-auto">
          {/* 제품 항목 스켈레톤 - 5개 아이템 생성 */}
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <li key={index} className="flex animate-pulse justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gray-200"></div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className="h-5 w-36 rounded-md bg-gray-200"></div>
                      {/* 랜덤한 너비로 D-날짜 영역 생성 */}
                      <div className="h-5 w-12 rounded-md bg-gray-200"></div>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-5.5 w-15 rounded-md bg-gray-200"></div>
                      <div className="h-5 w-20 rounded-md bg-gray-200"></div>
                    </div>
                  </div>
                </div>
                <div className="h-6 w-6 rounded-lg bg-gray-200"></div>
              </li>
            ))}
        </ul>
      </div>

      {/* 하단 버튼 스켈레톤 */}
      <div className="mt-3 mt-auto h-12 w-full animate-pulse rounded-2xl bg-gray-200 py-3"></div>
    </div>
  );
};

export default PocketListSkeleton;
