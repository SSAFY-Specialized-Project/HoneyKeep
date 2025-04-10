import { getAccountTransactionPocket } from '@/entities/account/api';
import { AccountDetail } from '@/entities/account/model/types';
import { AccountPocketInfo } from '@/entities/account/ui';
import { Transaction } from '@/entities/transaction/model/types';
import { addCommas, formatTime } from '@/shared/lib';
import { ResponseDTO } from '@/shared/model/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { Link, useParams } from 'react-router';

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

const PocketHistoryUse = () => {
  const { accountId, pocketId } = useParams();

  const { data: accountData } = useSuspenseQuery<ResponseDTO<AccountDetail>>({
    queryKey: ['account-detail', accountId],
    queryFn: () => {
      if (!accountId) throw new Error('계좌 ID가 필요합니다');
      return getAccountTransactionPocket(Number(accountId));
    },
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });

  const sortedTransactions = accountData?.data.transactionList
    ? [...accountData.data.transactionList].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    : [];

  // 날짜별 그룹핑
  const groupedTransactions = groupTransactionsByDate(sortedTransactions);
  // 그룹핑된 날짜 키들 (최신순 유지를 위해 정렬된 배열 사용)
  const dateGroups = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const handleItem = () => {};

  return (
    <div className="flex h-full flex-col gap-4 px-5">
      {accountData && (
        <AccountPocketInfo
          id={accountData.data.accountNumber}
          bank={accountData.data.bankName}
          account={accountData.data.accountName}
          accountNumber={accountData.data.accountNumber}
          currentAmount={accountData.data.accountBalance}
          remainingAmount={accountData.data.accountBalance - accountData.data.totalPocketAmount}
          pocketCount={accountData.data.pocketCount}
        />
      )}
      {/* 전체 스크롤 영역, 패딩 추가 */}
      <div className="flex h-full flex-col space-y-3 overflow-auto px-3 py-3">
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
                <button
                  type="button"
                  className="flex items-center justify-between border-b border-gray-100 py-3"
                  onClick={() => {
                    handleItem();
                  }}
                  key={transaction.id} // key를 TransactionListItem에 직접 전달
                >
                  <div className="flex space-x-3">
                    <span className="w-10 flex-shrink-0 text-sm text-gray-500">
                      {formatTime(transaction.date)}
                    </span>{' '}
                    {/* 시간 (고정폭) */}
                    <span className="truncate text-sm text-gray-800">{transaction.name}</span>
                  </div>

                  {/* 오른쪽: 금액 & 잔액 */}
                  <div className="ml-2 flex flex-col items-end">
                    <span
                      className={`text-sm font-semibold ${transaction.type === 'DEPOSIT' ? 'text-blue-600' : null}`}
                    >
                      {transaction.type === 'DEPOSIT' ? '+' : '−'}
                      {addCommas(Math.abs(transaction.amount))} 원
                    </span>
                    <span className="mt-0.5 text-xs text-gray-500">
                      {addCommas(transaction.balance)}원
                    </span>
                  </div>
                </button>
              ))}
            </React.Fragment>
          ))
        )}
      </div>
      <button
        type="button"
        onClick={() => {}}
        className="bg-brand-primary-500 xs:text-title-md text-text-lg cursor-pointer rounded-xl py-2.5 text-center font-bold text-white"
      >
        확인
      </button>
    </div>
  );
};

export default PocketHistoryUse;
