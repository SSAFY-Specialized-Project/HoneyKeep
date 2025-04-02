import { customFetchAPI } from "@/shared/api";
import {
  PocketGatherRequest,
  PocketGatherResponse,
} from "@/entities/pocket/model/types";

const patchPocketGatherAPI = (pocketId: number, data: PocketGatherRequest) =>
  customFetchAPI<PocketGatherResponse, PocketGatherRequest>({
    url: `/pockets/${pocketId}/add`,
    method: "PATCH",
    data,
  });

export default patchPocketGatherAPI;
