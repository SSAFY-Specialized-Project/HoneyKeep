import { getNotificationsAPI } from '@/entities/notification/api';
import { Notification } from '@/entities/notification/model/types';
import { getTimeAgo } from '@/shared/lib';
import { ResponseDTO } from '@/shared/model/types';
import { Icon } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlarmModal = ({ isOpen, setOpen }: Props) => {
  const handleClickSpace = () => {
    setOpen(false);
  };

  const { data: notiQuery } = useQuery<ResponseDTO<Notification[]>>({
    queryFn: getNotificationsAPI,
    queryKey: ['notifiactions'],
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div
      onClick={handleClickSpace}
      className={`absolute top-0 left-0 z-50 flex h-full w-full flex-col justify-start overflow-hidden bg-gray-950/50 p-5 transition-opacity duration-200 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`flex h-1/3 w-full flex-col gap-5 overflow-auto rounded-3xl bg-white p-5 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="flex justify-between">
          <span className="text-title-sm font-semibold">알림</span>
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => {
              setOpen(false);
            }}
          >
            <Icon id="x-lg" size="small" />
          </button>
        </div>
        <div className="flex h-full flex-col gap-5 overflow-auto px-2">
          {notiQuery != null && notiQuery.data.length > 0
            ? notiQuery.data.map((item) => {
                if (item.isRead) return null;

                return (
                  <li className="flex flex-col gap-2 rounded-xl bg-gray-100 p-3 text-gray-900">
                    <div className="flex justify-between">
                      <span>{item.title}</span>
                      <span>{getTimeAgo(item.createdAt)}</span>
                    </div>
                    <span>{item.body}</span>
                  </li>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
