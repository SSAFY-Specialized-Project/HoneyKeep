import { customFetchAPI } from '@/shared/api';
import { CategoryCreateRequest, CategoryCreateResponse } from '@/entities/category/model/types';

const createCategoryAPI = (data: CategoryCreateRequest) =>
  customFetchAPI<CategoryCreateResponse, CategoryCreateRequest>({
    url: '/categories',
    method: 'POST',
    data,
  });

export default createCategoryAPI;
