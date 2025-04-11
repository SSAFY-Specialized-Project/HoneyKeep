import { customFetchAPI } from '@/shared/api';
import { TransactionDetailResponse } from '@/entities/transaction/model/types';

const getTransactionDetailAPI = (transactionId: number) =>
  customFetchAPI<TransactionDetailResponse, void>({
    url: `/transactions/${transactionId}`,
    method: 'GET',
  });

export default getTransactionDetailAPI;
