import { useOutletContext } from 'react-router-dom';
import type { AccountDetail } from '@/entities/account/model/types';
import PocketListItem from '@/entities/pocket/ui/PocketListItem';

interface AccountContextType {
  accountData: AccountDetail;
}

const AccountPockets = () => {
  const { accountData } = useOutletContext<AccountContextType>();

  return (
    <>
      <div className="flex flex-col gap-4">
        {accountData?.pocketList?.length === 0 ? (
          <div className="text-text-md text-gray-600">현재 생성된 포켓이 없습니다.</div>
        ) : (
          accountData?.pocketList?.map((pocket) => (
            <PocketListItem
              key={pocket.id}
              id={pocket.id}
              name={pocket.name}
              imgUrl={pocket.imgUrl}
              totalAmount={pocket.totalAmount}
              endDate={pocket.endDate}
              type={pocket.type}
            />
          ))
        )}
      </div>
    </>
  );
};

export default AccountPockets;
