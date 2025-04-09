import { customFetchAPI } from '@/shared/api';
import {
  TransactionMemoResponse,
  TransactionMemoRequest,
} from '@/entities/transaction/model/types';

const patchTransactionMemoAPI = (transactionId: number, data: TransactionMemoRequest) =>
  customFetchAPI<TransactionMemoResponse, TransactionMemoRequest>({
    url: `/transactions/${transactionId}`,
    method: 'PATCH',
    data,
  });

export default patchTransactionMemoAPI;
