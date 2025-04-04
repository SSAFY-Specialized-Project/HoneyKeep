import { customFetchAPI } from '@/shared/api';
import { AccountListResponse } from '@/entities/account/model/types';

const getAllAccountAPI = () =>
  customFetchAPI<AccountListResponse, void>({
    url: '/accounts/',
    method: 'GET',
  });

export default getAllAccountAPI;
