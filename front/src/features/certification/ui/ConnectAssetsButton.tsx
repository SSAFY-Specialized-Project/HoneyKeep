interface ConnectAssetsButtonProps {
  selectedCount: number;
  onClick: () => void;
}

export const ConnectAssetsButton = ({ selectedCount, onClick }: ConnectAssetsButtonProps) => {
  return (
    <button
      className={`w-full cursor-pointer rounded-xl py-4 text-lg font-bold ${
        selectedCount > 0
          ? 'bg-brand-primary-500 hover:bg-brand-primary-400 text-white'
          : 'cursor-not-allowed bg-gray-200 text-gray-500'
      }`}
      disabled={selectedCount === 0}
      onClick={onClick}
    >
      {selectedCount > 0 ? `${selectedCount}개 연결하기` : '연결할 자산을 선택해주세요'}
    </button>
  );
};
