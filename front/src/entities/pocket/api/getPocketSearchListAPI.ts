import { customFetchAPI } from "@/shared/api";
import { PocketSearchResponse } from "@/entities/pocket/model/types";

const getPocketSearchListAPI = (pocketName: string) =>
  customFetchAPI<PocketSearchResponse, void>({
    url: `/pockets/search?name=${pocketName}`,
    method: "GET",
  });

export default getPocketSearchListAPI;
