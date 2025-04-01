import { customFetchAPI } from "@/shared/api";
import {
  PocketUpdateRequest,
  PocketUpdateResponse,
} from "@/entities/pocket/model/types";

const updatePocket = (data: PocketUpdateRequest) =>
  customFetchAPI<PocketUpdateResponse, PocketUpdateRequest>({
    url: "/pockets",
    method: "PUT",
    data,
  });

export default updatePocket;
