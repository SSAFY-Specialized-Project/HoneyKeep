export interface Transaction {
  id: number;
  userName: string;
  amount: number;
  balance: number;
  date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
}

export interface TransactionDetail {
  id: number;
  name: string;
  amount: number;
  balance: number;
  date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  accountId: number;
  accountName: string;
  memo: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
}

export interface TransactionDetailResponse {
  transaction: TransactionDetail;
}

export interface TransactionMemoRequest {
  memo: string;
}

export interface TransactionMemoResponse {
  id: number;
  memo: string;
}
