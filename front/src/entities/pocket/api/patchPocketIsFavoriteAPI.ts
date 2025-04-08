import { customFetchAPI } from "@/shared/api";
import {
  PocketIsFavoriteRequest,
  PocketIsFavoriteResponse,
} from "@/entities/pocket/model/types";

const patchPocketIsFavoriteAPI = (
  {
    pocketId,
    data
  }:{
    pocketId: number,
    data: PocketIsFavoriteRequest
  }
) =>
  customFetchAPI<PocketIsFavoriteResponse, PocketIsFavoriteRequest>({
    url: `/pockets/${pocketId}/favorite`,
    method: "PATCH",
    data,
  });

export default patchPocketIsFavoriteAPI;
