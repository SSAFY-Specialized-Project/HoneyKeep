import { Icon } from '@/shared/ui';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router';

interface Props {
  title: string;
  content: ReactNode;
}

const HistoryButtonHeader = ({ title, content }: Props) => {
  const navigate = useNavigate();

  return (
    <header className="flex w-full items-center justify-between p-5">
      <button
        type="button"
        className="cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      >
        <Icon id="chevron-left" size="big" />
      </button>
      <h1>{title}</h1>
      {content}
    </header>
  );
};

export default HistoryButtonHeader;
