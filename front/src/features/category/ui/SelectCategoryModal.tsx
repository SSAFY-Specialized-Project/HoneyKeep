import { CategoryIcon, Icon } from '@/shared/ui';

interface Props {
  isOpen: boolean;
  setId: React.Dispatch<React.SetStateAction<number>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectCategoryModal = ({ isOpen, setId, setOpen }: Props) => {
  const CATEGORY_COUNT = 8;
  const numbers = Array.from({ length: CATEGORY_COUNT }, (_, i) => i + 1);

  const handleClickSpace = () => {
    setOpen(false);
  };

  return (
    <div
      onClick={handleClickSpace}
      className={`absolute top-0 left-0 z-50 flex h-full w-full flex-col justify-end overflow-hidden bg-gray-950/50 transition-opacity duration-200 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`flex w-full flex-col gap-5 overflow-auto rounded-t-3xl bg-white p-5 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between">
          <span className="text-title-sm font-semibold">아이콘</span>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            <Icon id="x-lg" size="small" />
          </button>
        </div>
        <div className="flex flex-wrap gap-5">
          {numbers.map((number) => (
            <CategoryIcon key={number} category={number} size="normal" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectCategoryModal;
