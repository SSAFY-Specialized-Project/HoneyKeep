interface Props {
  isActive: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleButton = ({ isActive, setActive }: Props) => {
  return (
    <button
      type="button"
      onClick={() => {
        setActive(!isActive);
      }}
      className={`flex h-5 w-10.5 cursor-pointer flex-col items-center rounded-full px-2 py-1 ${isActive ? 'bg-brand-primary-500' : 'bg-gray-300'}`}
    >
      <div
        className={`h-3 w-3 rounded-full bg-white transition-all duration-150 ease-in-out ${isActive ? 'translate-x-11/12' : '-translate-x-11/12'}`}
      ></div>
    </button>
  );
};

export default ToggleButton;
