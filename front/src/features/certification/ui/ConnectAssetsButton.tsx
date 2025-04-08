interface ConnectAssetsButtonProps {
    selectedCount: number;
    onClick: () => void;
}

export const ConnectAssetsButton = ({ selectedCount, onClick }: ConnectAssetsButtonProps) => {
    return (
        <button
            className={`w-full rounded-xl py-4 font-bold text-lg ${ 
                selectedCount > 0
                    ? "bg-brand-primary-500 text-white hover:bg-brand-primary-400"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={selectedCount === 0}
            onClick={onClick}
        >
            {selectedCount > 0 ? `${selectedCount}개 연결하기` : '연결할 자산을 선택해주세요'}
        </button>
    );
}; 