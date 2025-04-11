import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AccountSimpleInfo from '@/entities/account/ui/AccountSimpleInfo';
import TransactionListItem from '@/entities/transaction/ui/TransactionListItem';
import { Transaction } from '@/entities/transaction/model/types';
import { useQuery } from '@tanstack/react-query';
import { getAccountTransactionPocket } from '@/entities/account/api';

// 계좌 정보를 URL 파라미터나 state로 받아올 것으로 가정
const RecentTransactionChoice = () => {
  const navigate = useNavigate();

  // URL 파라미터로 받는 경우
  const { accountId } = useParams();

  // state로 받는 경우
  const location = useLocation();
  const { accountId: stateAccountId } = location.state;

  // 계좌 정보와 거래 내역을 가져오는 쿼리
  const { data: accountData, isLoading } = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => getAccountTransactionPocket(accountId),
  });

  const handleTransactionSelect = (transaction: Transaction) => {
    // 선택된 거래내역 처리 로직
    // 예: 포켓에 거래내역 추가 후 이전 페이지로 이동
    console.log('Selected transaction:', transaction);
    navigate(-1);
  };

  if (isLoading || !accountData) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-gray-600">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="fixed top-0 right-0 left-0 z-10 flex items-center bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center text-gray-800"
        >
          <span className="text-xl">←</span>
        </button>
        <h1 className="ml-2 text-lg font-bold">거래 내역을 선택해주세요</h1>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="mt-[60px] flex flex-col">
        {/* 계좌 정보 */}
        <div className="bg-white">
          <AccountSimpleInfo
            bank={accountData.bankName}
            account={accountData.accountName}
            accountNumber={accountData.accountNumber}
            currentAmount={accountData.balance}
          />
        </div>

        {/* 거래 내역 리스트 */}
        <div className="mt-2 flex-1 bg-white p-4">
          {accountData.transactionList.length === 0 ? (
            <div className="flex h-full items-center justify-center py-8">
              <span className="text-gray-600">거래 내역이 없습니다.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {accountData.transactionList.map((transaction) => (
                <div
                  key={transaction.id}
                  onClick={() => handleTransactionSelect(transaction)}
                  className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <TransactionListItem
                    id={transaction.id}
                    name={transaction.name}
                    amount={transaction.amount}
                    balance={transaction.balance}
                    date={transaction.date}
                    type={transaction.type}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactionChoice;
