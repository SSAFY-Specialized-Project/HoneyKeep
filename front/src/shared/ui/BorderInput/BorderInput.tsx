interface Props {
  type: string;
  label: string;
  labelText?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  regText?: string;
  content?: React.ReactNode;
}

const BorderInput = ({
  type,
  label,
  labelText,
  placeholder,
  value,
  onChange,
  regText,
  content,
}: Props) => {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="">
        <label
          htmlFor={label}
          className={`${labelText ? 'text-text-sm text-gray-700' : 'sr-only'}`}
        >
          {labelText}
        </label>
        <div className="flex justify-between">
          <input
            type={type}
            name={label}
            id={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="text-title-sm w-full border-b border-gray-400 py-2.5 font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {content ? content : null}
        </div>
      </div>
      {regText ?? <span className="text-gray-600">{regText}</span>}
    </div>
  );
};

export default BorderInput;
