import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AccountDetail } from '@/entities/account/model/types';
import { Transaction } from '@/entities/transaction/model/types';
import TransactionListItem from '@/entities/transaction/ui/TransactionListItem';

interface AccountContextType {
  accountData: AccountDetail;
}

// 날짜 문자열에서 "YYYY-MM-DD" 형식 추출
const getFullDateString = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error('Invalid date');
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
  } catch (e) {
    console.error('Error getting full date string:', dateString, e);
    return '';
  }
};

// 날짜 구분선 포맷 (예: "9월 15일 금요일")
const formatDateSeparator = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error('Invalid date');
    // Intl.DateTimeFormat을 사용하여 로케일에 맞는 형식 생성
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', weekday: 'long' };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  } catch (e) {
    console.error('Error formatting date separator:', dateString, e);
    return '';
  }
};

// 거래 내역을 날짜별로 그룹핑하는 함수
const groupTransactionsByDate = (transactions: Transaction[]) => {
  if (!transactions || transactions.length === 0) {
    return {};
  }
  return transactions.reduce(
    (acc, transaction) => {
      const fullDate = getFullDateString(transaction.date);
      if (!acc[fullDate]) {
        acc[fullDate] = [];
      }
      acc[fullDate].push(transaction);
      return acc;
    },
    {} as Record<string, Transaction[]>,
  ); // 타입 명시
};

const AccountTransactions = () => {
  const { accountData } = useOutletContext<AccountContextType>();

  const sortedTransactions = accountData?.transactionList
    ? [...accountData.transactionList].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    : [];

  // 날짜별 그룹핑
  const groupedTransactions = groupTransactionsByDate(sortedTransactions);
  // 그룹핑된 날짜 키들 (최신순 유지를 위해 정렬된 배열 사용)
  const dateGroups = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <>
      {/* 전체 스크롤 영역, 패딩 추가 */}
      <div className="flex flex-col space-y-3">
        {dateGroups.length === 0 ? (
          <div className="xs:text-text-lg text-text-md py-10 text-center text-gray-600">
            거래 내역이 없습니다.
          </div>
        ) : (
          // 날짜 그룹별로 순회
          dateGroups.map((dateKey) => (
            // 날짜 그룹 Fragment (key 필요)
            <React.Fragment key={dateKey}>
              {/* 날짜 구분선 */}
              <div className="my-3 flex justify-center">
                <span className="xs:text-sm rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                  {formatDateSeparator(dateKey)}
                </span>
              </div>

              {/* 해당 날짜의 거래 내역 목록 */}
              {groupedTransactions[dateKey].map((transaction: Transaction) => (
                // TransactionListItem 렌더링 (별도 div 불필요, key는 여기에)
                <TransactionListItem
                  key={transaction.id} // key를 TransactionListItem에 직접 전달
                  id={transaction.id}
                  name={transaction.name}
                  amount={transaction.amount}
                  balance={transaction.balance}
                  date={transaction.date} // 시간 표시용
                  type={transaction.type} // type 전달
                />
              ))}
            </React.Fragment>
          ))
        )}
      </div>
    </>
  );
};

export default AccountTransactions;
