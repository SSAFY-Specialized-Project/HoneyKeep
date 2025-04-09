import { Icon } from '@/shared/ui';

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlarmModal = ({ isOpen, setOpen }: Props) => {
  const handleClickSpace = () => {
    setOpen(false);
  };

  return (
    <div
      onClick={handleClickSpace}
      className={`absolute top-0 left-0 z-50 flex h-full w-full flex-col justify-start overflow-hidden bg-gray-950/50 p-5 transition-opacity duration-200 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`flex w-full flex-col gap-5 overflow-auto rounded-3xl bg-white p-5 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="flex justify-between">
          <span className="text-title-sm font-semibold">알림</span>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            <Icon id="x-lg" size="small" />
          </button>
        </div>
        <div className="flex flex-wrap gap-5"></div>
      </div>
    </div>
  );
};

export default AlarmModal;
