import { customFetchAPI } from '@/shared/api';
import { CategoryPocketListResponse } from '@/entities/category/model/types';

const getCategoryPocketListAPI = (categoryId: number) =>
  customFetchAPI<CategoryPocketListResponse, void>({
    url: `/categories/${categoryId}/pockets`,
    method: 'GET',
  });

export default getCategoryPocketListAPI;
