import { customFetchAPI } from '@/shared/api';
import { PocketTypeChangeResponse } from '@/entities/pocket/model/types';

const patchPocketUsingAPI = (pocketId: number) =>
  customFetchAPI<PocketTypeChangeResponse, void>({
    url: `/pockets/${pocketId}/start-using`,
    method: 'PATCH',
  });

export default patchPocketUsingAPI;
