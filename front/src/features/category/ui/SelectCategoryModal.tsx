import { Icon } from '@/shared/ui';

interface Props {
  isOpen: boolean;
  setId: React.Dispatch<React.SetStateAction<number>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectCategoryModal = ({ isOpen, setId, setOpen }: Props) => {
  return (
    <div className={``}>
      <div className="flex w-full flex-col gap-3">
        <div className="flex justify-between">
          <span>아이콘</span>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            <Icon id="x-lg" size="small" />
          </button>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default SelectCategoryModal;
