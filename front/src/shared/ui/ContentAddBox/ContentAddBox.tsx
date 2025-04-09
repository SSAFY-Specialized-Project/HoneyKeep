interface Props {
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ContentAddBox = ({ text, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer rounded-[1.25rem] border border-dashed border-gray-400 py-15"
    >
      <span className="text-text-xl text-center text-gray-400">{`+ ${text}`}</span>
    </button>
  );
};

export default ContentAddBox;
