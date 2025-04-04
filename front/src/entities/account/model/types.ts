import { Bank } from '@/shared/model/types';
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

export interface Transaction {
  transactionId: number;
  transactionDate: string;
  transactionAmount: number;
}

export interface AccountListResponse {
  accountList: Account[];
}

export interface AccountDetailResponse {
  accountId: number;
  accountNumber: string;
  accountBalance: number;
  bankName: Bank;
  accountName: string;
  totalPocketAmount: number;
  pocketCount: number;
  spareBalance: number;
  transactionList: Transaction[];
  pocketList: Pocket[];
}
