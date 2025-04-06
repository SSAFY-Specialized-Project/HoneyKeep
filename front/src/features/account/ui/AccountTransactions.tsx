import { useOutletContext } from 'react-router-dom';
import { AccountDetail } from '@/entities/account/model/types';
import { Transaction } from '@/entities/transaction/model/types';
import TransactionListItem from '@/entities/transaction/ui/TransactionListItem';

interface AccountContextType {
  accountData: AccountDetail;
}

const AccountTransactions = () => {
  const { accountData } = useOutletContext<AccountContextType>();

  return (
    <>
      <div className="flex flex-col gap-4">
        {accountData?.transactionList?.length === 0 ? (
          <div className="text-text-md text-gray-600">거래 내역이 없습니다.</div>
        ) : (
          accountData?.transactionList?.map((transaction: Transaction) => (
            <TransactionListItem
              key={transaction.id}
              id={transaction.id}
              name={transaction.name}
              amount={transaction.amount}
              balance={transaction.balance}
              date={transaction.date}
            />
          ))
        )}
      </div>
    </>
  );
};

export default AccountTransactions;
