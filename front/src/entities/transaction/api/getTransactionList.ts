import { customFetchAPI } from '@/shared/api';
import { TransactionListResponse } from '@/entities/transaction/model/type';

const getTransactionListAPI = (accountId: number) =>
  customFetchAPI<TransactionListResponse, void>({
    url: `/transactions?accountId=${accountId}`,
    method: 'GET',
  });

export default getTransactionListAPI;
