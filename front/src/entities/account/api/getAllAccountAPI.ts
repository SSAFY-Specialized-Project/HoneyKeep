import { customFetchAPI } from '@/shared/api';
import { Account } from '../model/types';

const getAllAccountAPI = () =>
  customFetchAPI<Account[], void>({
    url: '/accounts/',
    method: 'GET',
    credentials: 'include',
  });

export default getAllAccountAPI;
