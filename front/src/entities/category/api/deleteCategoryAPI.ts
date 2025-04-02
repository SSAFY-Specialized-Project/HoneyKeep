import { customFetchAPI } from '@/shared/api';

const deleteCategoryAPI = (categoryId: number) =>
  customFetchAPI<void, void>({
    url: `/categories/${categoryId}`,
    method: 'DELETE',
  });

export default deleteCategoryAPI;
