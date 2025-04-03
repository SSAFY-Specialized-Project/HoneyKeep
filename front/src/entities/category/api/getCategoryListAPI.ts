import { customFetchAPI } from '@/shared/api';
import { CategoryListResponse } from '@/entities/category/model/types';

const getCategoryListAPI = () =>
  customFetchAPI<CategoryListResponse, void>({
    url: '/categories',
    method: 'GET',
  });

export default getCategoryListAPI;
