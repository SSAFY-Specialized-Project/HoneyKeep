import { customFetchAPI } from "@/shared/api";
import { PocketCreateLinkRequest, PocketCreateLinkResponse } from "@/entities/pocket/model/types";

const createPocketLinkAPI = (data: PocketCreateLinkRequest) => customFetchAPI<PocketCreateLinkResponse , PocketCreateLinkRequest>({
  url: "/pockets/link",
  method: "POST",
  data
});

export default createPocketLinkAPI;