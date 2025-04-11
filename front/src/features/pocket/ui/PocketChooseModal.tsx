import { getAccountTransactionPocket } from '@/entities/account/api';
import { PocketChooseItem } from '@/entities/pocket/ui';
import { usePocketChooseStore } from '@/shared/store';
import { Icon } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';

interface Props {
  isOpen: boolean;
}

const PocketChooseModal = ({ isOpen }: Props) => {
  const { closeModal, modalProps, setPocketId, setPocketName } = usePocketChooseStore();

  // 닫힘 클릭 이벤트 핸들러
  const handleClickSpace = () => {
    closeModal();
  };

  const { data: pocketData } = useQuery({
    queryFn: () => {
      if (modalProps == null) return;
      return getAccountTransactionPocket(modalProps.accountId);
    },
    queryKey: ['account-detail', modalProps?.accountId],
    staleTime: 1000 * 60 * 10,
    enabled: !!modalProps?.accountId,
  });

  // 카테고리 클릭 이벤트 핸들러
  const handleClickPocket = (e: React.MouseEvent<HTMLButtonElement>) => {
    const categoryId = e.currentTarget.dataset.index;

    if (!categoryId) return;

    closeModal();
  };

  return (
    <div
      onClick={handleClickSpace}
      className={`absolute top-0 left-0 z-50 flex h-full w-full flex-col justify-end overflow-hidden bg-gray-950/50 p-5 transition-opacity duration-200 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`flex h-1/2 w-full flex-col gap-5 overflow-auto rounded-3xl bg-white p-5 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between">
          <span className="text-title-sm font-semibold">아이콘</span>
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => {
              closeModal();
            }}
          >
            <Icon id="x-lg" size="small" />
          </button>
        </div>
        <ul className="h-full overflow-auto">
          {pocketData != null && pocketData.data.pocketList.length > 0
            ? pocketData?.data.pocketList.map((item) => {
                return (
                  <li>
                    <PocketChooseItem
                      id={item.id}
                      name={item.name}
                      imgUrl={item.imgUrl}
                      totalAmount={item.totalAmount}
                      savedAmount={item.savedAmount}
                    />
                  </li>
                );
              })
            : null}
        </ul>
      </div>
    </div>
  );
};

export default PocketChooseModal;
