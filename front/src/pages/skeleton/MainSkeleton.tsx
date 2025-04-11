// 스켈레톤 계좌 카드
const AccountCardSkeleton = () => {
  return (
    <li className="w-full animate-pulse list-none rounded-[1.25rem] shadow-md">
      <div className="flex w-full flex-col items-end gap-3 rounded-[1.25rem] p-5">
        <div className="flex w-full justify-between">
          <div className="flex gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200"></div>
            <div className="flex flex-col items-start">
              <div className="mb-1 h-6 w-24 rounded bg-gray-200"></div>
              <div className="h-4 w-32 rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="relative">
            <div className="flex justify-between gap-1.5">
              <div className="h-4 w-16 rounded bg-gray-200"></div>
              <div className="h-4 w-16 rounded bg-gray-200"></div>
            </div>
            <div className="mt-1 flex justify-between gap-1.5">
              <div className="h-4 w-16 rounded bg-gray-200"></div>
              <div className="h-4 w-16 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
        <div className="mt-2 h-8 w-20 rounded-lg bg-gray-200"></div>
      </div>
    </li>
  );
};

// 포켓 스켈레톤
const PocketSkeleton = () => {
  return (
    <li className="flex animate-pulse flex-col gap-2 rounded-2xl p-5 shadow-md">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
          <div className="flex flex-col items-start justify-center">
            <div className="mb-1 h-6 w-16 rounded bg-gray-200"></div>
            <div className="flex gap-2">
              <div className="h-4 w-12 rounded bg-gray-200"></div>
              <div className="h-4 w-16 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    </li>
  );
};

// 전체 스켈레톤 UI
const MainSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 px-5 pt-5">
      {/* 계좌 정보 섹션 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="relative flex gap-2">
            <div className="h-6 w-24 rounded bg-gray-200"></div>
            <div className="h-6 w-6 rounded-lg bg-gray-200"></div>
          </div>
          <div className="h-10 w-16 rounded-lg bg-gray-200"></div>
        </div>

        {/* 계좌 카드 목록 */}
        <ul className="flex flex-col gap-3">
          {[...Array(2)].map((_, index) => (
            <AccountCardSkeleton key={index} />
          ))}
        </ul>
      </div>

      {/* 포켓 섹션 */}
      <div className="flex flex-col gap-2">
        <div className="mb-2 h-6 w-20 rounded bg-gray-200"></div>
        <PocketSkeleton />
        <div className="mt-3 h-12 w-full rounded-2xl bg-gray-200"></div>
      </div>
    </div>
  );
};

export default MainSkeleton;
