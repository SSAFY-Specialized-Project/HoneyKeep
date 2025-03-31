interface Props {
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ContentAddBox = ({ text, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="py-15 w-full border border-dashed border-gray-400 rounded-[1.25rem]"
    >
      <span className="text-gray-400 text-text-xl text-center">{`+ ${text}`}</span>
    </button>
  );
};

export default ContentAddBox;
