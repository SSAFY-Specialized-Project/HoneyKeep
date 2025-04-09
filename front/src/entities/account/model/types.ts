import { Bank } from '@/shared/model/types';
import { Transaction } from '@/entities/transaction/model/types';
import { Pocket } from '@/entities/pocket/model/types';

export interface Account {
  accountId: number;
  accountNumber: string;
  accountBalance: number;
  accountName: string;
  bankName: Bank;
  totalPocketAmount: number;
  pocketCount: number;
  spareBalance: number;
}

export interface AccountDetail extends Account {
  transactionList: Transaction[];
  pockets: Pocket[];
  pocketList: Pocket[];
}

export default Account;
