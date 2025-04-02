import { customFetchAPI } from '@/shared/api';
import { CategoryUpdateRequest, CategoryUpdateResponse } from '@/entities/category/model/types';

const updateCategoryAPI = (categoryId: number, data: CategoryUpdateRequest) =>
  customFetchAPI<CategoryUpdateResponse, CategoryUpdateRequest>({
    url: `/categories/${categoryId}`,
    method: 'PUT',
    data,
  });

export default updateCategoryAPI;
