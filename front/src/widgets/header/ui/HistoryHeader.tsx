import { useHeaderStore } from '@/shared/store';
import { Icon } from '@/shared/ui';
import { useNavigate } from 'react-router';

const HistoryHeader = () => {
  const navigate = useNavigate();
  const title = useHeaderStore((state) => state.title);
  const content = useHeaderStore((state) => state.content);

  return (
    <header className="flex w-full items-center p-5">
      <button
        type="button"
        className="cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      >
        <Icon id="chevron-left" size="big" />
      </button>
      <div className="flex-1 text-center">
        {title != null ? <h1 className="text-text-xl font-semibold">{title}</h1> : null}
      </div>
      <div className="">{content}</div>
    </header>
  );
};

export default HistoryHeader;
