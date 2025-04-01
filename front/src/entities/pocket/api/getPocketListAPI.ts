import { customFetchAPI } from "@/shared/api";
import { PocketListResponse } from "@/entities/pocket/model/types";

const getPocketListAPI = () =>
  customFetchAPI<PocketListResponse, void>({
    url: "/pockets",
    method: "GET",
  });

export default getPocketListAPI;
