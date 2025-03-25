interface Props {
  text: string;
  size?: "big" | "small";
  isChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Checkbox = ({
  text,
  size = "small",
  isChecked,
  onChange,
  onClick,
}: Props) => {
  const TEXT_PROPS = {
    big: "text-text-xl",
    small: "text-text-md",
  };

  const INPUT_PROPS = {
    big: "w-8",
    small: "w-5",
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={isChecked}
          className={`${INPUT_PROPS[size]}`}
          onChange={onChange}
        />
        <label htmlFor="" className={`${TEXT_PROPS[size]}`}>
          {text}
        </label>
      </div>
      <button type="button" onClick={onClick}>
        아이콘
      </button>
    </div>
  );
};

export default Checkbox;
