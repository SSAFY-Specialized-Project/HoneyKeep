interface Props {
  text: string;
  size?: 'big' | 'small';
  isChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showButton?: boolean;
}

const Checkbox = ({
  text,
  size = 'small',
  isChecked,
  onChange,
  onClick,
  showButton = false,
}: Props) => {
  const TEXT_PROPS = {
    big: 'text-text-xl',
    small: 'text-text-md',
  };

  const INPUT_PROPS = {
    big: 'w-8',
    small: 'w-5',
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <div className="flex items-center">
          <img
            src={isChecked ? '/icon/assets/check-square-fill.svg' : '/icon/assets/check-square.svg'}
            alt={isChecked ? '선택됨' : '선택되지 않음'}
            className={`${INPUT_PROPS[size]}`}
            onClick={() => {
              const dummyEvent = {
                currentTarget: {
                  checked: !isChecked,
                },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(dummyEvent);
            }}
          />
        </div>
        <label htmlFor="" className={`${TEXT_PROPS[size]}`}>
          {text}
        </label>
      </div>
      {showButton && onClick && (
        <button type="button" onClick={onClick}>
          <img src="/icon/assets/x-lg.svg" alt="닫기" className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Checkbox;
