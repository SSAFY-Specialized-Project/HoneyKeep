import { customFetchAPI } from '@/shared/api';
import { Category } from '@/entities/category/model/types';

const getCategoryListAPI = () =>
  customFetchAPI<Category[], void>({
    url: '/categories',
    method: 'GET',
  });

export default getCategoryListAPI;
