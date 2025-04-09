import { customFetchAPI } from '@/shared/api';
import { AccountDetail } from '@/entities/account/model/types';

const getAccountTransactionPocket = (accountId: number) =>
  customFetchAPI<AccountDetail, void>({
    url: `/accounts/${accountId}`,
    method: 'GET',
    credentials: 'include',
  });

export default getAccountTransactionPocket;
