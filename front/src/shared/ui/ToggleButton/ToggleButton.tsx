interface Props {
  isActive: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleButton = ({ isActive, setActive }: Props) => {
  return (
    <div
      onClick={() => {
        setActive(!isActive);
      }}
      className={`h-[1.75rem] w-[2.625rem] rounded-full ${isActive ? 'bg-brand-primary-500' : 'bg-gray-300'}`}
    >
      <div></div>
    </div>
  );
};

export default ToggleButton;
