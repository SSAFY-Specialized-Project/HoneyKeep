const BankPageSkeleton = () => {
  return (
    <div className="bg-brand-background flex h-full flex-1 flex-col px-5">
      {/* 상단 계좌 정보 스켈레톤 */}
      <div className="mb-5">
        <li className="shadow-custom w-full animate-pulse list-none rounded-[1.25rem]">
          <div className="flex w-full flex-col gap-2.5 p-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200"></div>
                <div className="flex flex-col">
                  <div className="h-5 w-48 rounded-md bg-gray-200"></div>
                  <div className="mt-1 h-4 w-40 rounded-md bg-gray-200"></div>
                </div>
              </div>
              <div className="h-5 w-24 rounded-md bg-gray-200"></div>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex w-full justify-between">
                <div className="h-5 w-24 rounded-md bg-gray-200"></div>
                <div className="h-5 w-24 rounded-md bg-gray-200"></div>
              </div>
              <div className="flex w-full justify-between">
                <div className="h-4 w-20 rounded-md bg-gray-200"></div>
                <div className="h-4 w-16 rounded-md bg-gray-200"></div>
              </div>
            </div>
          </div>
        </li>
      </div>

      {/* 탭 메뉴 스켈레톤 */}
      <div className="flex w-full border-b border-gray-200">
        <div className="border-brand-primary-500 flex-1 border-b-2 py-2 text-center">
          <div className="mx-auto h-6 w-16 rounded-md bg-gray-200"></div>
        </div>
        <div className="flex-1 border-b-2 border-transparent py-2 text-center">
          <div className="mx-auto h-6 w-16 rounded-md bg-gray-200"></div>
        </div>
      </div>

      {/* 거래 내역 스켈레톤 */}
      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* 거래 내역 없음 대신 스켈레톤 표시 */}
          <div className="h-6 w-48 rounded-md bg-gray-200"></div>
          {/* 추가 거래 내역 스켈레톤 아이템들 */}
          <div className="h-16 w-full rounded-md bg-gray-200"></div>
          <div className="h-16 w-full rounded-md bg-gray-200"></div>
          <div className="h-16 w-full rounded-md bg-gray-200"></div>
        </div>
      </div>

      {/* 하단 버튼 스켈레톤 */}
      <div className="mt-3 mt-auto h-12 w-full rounded-2xl bg-gray-200 py-3"></div>
    </div>
  );
};

export default BankPageSkeleton;
