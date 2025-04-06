import { useHeaderStore } from '@/shared/store';
import { Icon } from '@/shared/ui';
import { useNavigate } from 'react-router';

const HistoryHeader = () => {
  const navigate = useNavigate();
  const title = useHeaderStore((state) => state.title);
  const content = useHeaderStore((state) => state.content);

  return (
    <header className={`flex w-full justify-between p-5`}>
      <button
        type="button"
        className="cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      >
        <Icon id="chevron-left" size="big" />
      </button>
      {title != null ? <h1 className="text-title-sm font-bold text-gray-900">{title}</h1> : null}
      {content != null ? content : <div></div>}
    </header>
  );
};

export default HistoryHeader;
