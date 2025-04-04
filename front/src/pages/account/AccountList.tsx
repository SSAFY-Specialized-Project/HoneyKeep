import { useEffect, useState } from 'react';
import { AccountPocketInfo } from '@/entities/account/ui';
import { getAllAccountAPI } from '@/entities/account/api';
import { Link } from 'react-router';
import { Account } from '@/entities/account/model/types';

const AccountList = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await getAllAccountAPI();
        setAccounts(data.accountList || []);
      } catch (error) {
        console.error('계좌 목록을 불러오는데 실패했습니다.', error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex-1 p-5">
        <section className="mb-6">
          <h2 className="text-text-lg mb-4 font-medium text-gray-800">입출금계좌</h2>
          <ul className="flex flex-col gap-4">
            {accounts.map((account) => (
              <AccountPocketInfo
                key={account.accountId}
                id={account.accountId.toString()}
                bank={account.bankName}
                account={account.accountName}
                accountNumber={account.accountNumber}
                currentAmount={account.accountBalance}
                remainingAmount={account.spareBalance}
                pocketCount={account.pocketCount}
              />
            ))}
          </ul>
        </section>
      </main>

      <footer className="p-5">
        <Link
          to="/account/add"
          className="bg-brand-primary-500 text-text-lg flex h-14 w-full items-center justify-center rounded-2xl font-semibold text-white"
        >
          내 자산 추가하기
        </Link>
      </footer>
    </div>
  );
};

export default AccountList;
