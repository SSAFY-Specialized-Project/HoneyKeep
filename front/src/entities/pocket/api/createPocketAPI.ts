import { customFetchAPI } from "@/shared/api";
import {
  PocketCreateRequest,
  PocketCreateResponse,
} from "@/entities/pocket/model/types";

const createPocketAPI = (data: PocketCreateRequest) =>
  customFetchAPI<PocketCreateResponse, PocketCreateRequest>({
    url: "/pockets",
    method: "POST",
    data,
  });

export default createPocketAPI;
