import { customFetchAPI } from '@/shared/api';
import { PocketTypeChangeResponse } from '@/entities/pocket/model/types';

const patchPocketUsedAPI = (pocketId: number) =>
  customFetchAPI<PocketTypeChangeResponse, void>({
    url: `/pockets/${pocketId}/complete`,
    method: 'PATCH',
  });

export default patchPocketUsedAPI;
