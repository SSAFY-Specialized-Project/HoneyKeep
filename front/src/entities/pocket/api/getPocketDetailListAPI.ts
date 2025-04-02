import { customFetchAPI } from "@/shared/api";
import { PocketDetailResponse } from "@/entities/pocket/model/types";

const getPocketDetailAPI = (pocketId: number) =>
  customFetchAPI<PocketDetailResponse, void>({
    url: `/pockets/${pocketId}`,
    method: "GET",
  });

export default getPocketDetailAPI;
