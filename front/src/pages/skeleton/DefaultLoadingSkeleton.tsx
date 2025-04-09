const DefaultLoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* 카드 형태의 스켈레톤 */}
      <div className="w-full animate-pulse rounded-2xl p-5 shadow-md">
        <div className="flex w-full justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200"></div>
            <div className="flex flex-col">
              <div className="mb-1 h-5 w-32 rounded bg-gray-200"></div>
              <div className="h-4 w-24 rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="h-6 w-20 rounded bg-gray-200"></div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
            <div className="h-4 w-16 rounded bg-gray-200"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded bg-gray-200"></div>
            <div className="h-4 w-12 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* 단순 리스트 항목들 */}
      <div className="flex flex-col">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center justify-between border-b border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
              <div className="flex flex-col">
                <div className="h-5 w-32 rounded bg-gray-200"></div>
                <div className="mt-1 h-4 w-24 rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="h-6 w-6 rounded-lg bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DefaultLoadingSkeleton;
