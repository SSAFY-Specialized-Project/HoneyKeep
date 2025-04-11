interface Props {
  text: string;
  type?: "button" | "submit";
  // size?: "big" | "normal" | "small";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button = ({
  text,
  type = "button",
  // size = "normal",
  disabled = true,
  onClick,
  onSubmit,
  className = "",
}: Props) => {
  // const BUTTON_SIZE_STYLE = {
  //   big: "py-5 text-title-md",
  //   normal: "",
  //   small: "",
  // };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onSubmit={onSubmit}
      className={`w-full py-5 bg-brand-primary-500 disabled:bg-gray-100 disabled:cursor-default disabled:text-gray-400 hover:bg-brand-primary-600 font-bold text-title-md rounded-2xl cursor-pointer ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
