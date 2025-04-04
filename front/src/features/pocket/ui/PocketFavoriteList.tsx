const PocketFavoriteList = () => {
  // 즐겨찾기 받아오는 getQuery 필요

  const handleGetFavorite = () => {};

  return (
    <div className="flex h-full flex-col">
      <ul className="flex flex-col gap-4 overflow-auto"></ul>
      <button
        type="button"
        disabled={false}
        onClick={handleGetFavorite}
        className="bg-brand-primary-500 text-title-md mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-400"
      >
        생성하기
      </button>
    </div>
  );
};

export default PocketFavoriteList;
