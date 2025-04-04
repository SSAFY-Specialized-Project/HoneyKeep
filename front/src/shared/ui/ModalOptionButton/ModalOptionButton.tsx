import Icon from '../Icon/Icon';

interface Props {
  icon: string;
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ModalOptionButton = ({ icon, text, onClick }: Props) => {
  return (
    <button type="button" onClick={onClick} className="flex cursor-pointer items-center gap-2">
      <Icon size="small" id={icon} />
      <span className="text-title-sm font-semibold text-gray-900">{text}</span>
    </button>
  );
};

export default ModalOptionButton;
