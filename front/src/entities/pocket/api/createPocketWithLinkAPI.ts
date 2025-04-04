import { customFetchAPI } from "@/shared/api";
import { PocketCreateWithLinkRequest, PocketCreateWithLinkResponse } from "../model/types";

const createPocketWithLinkAPI = (data: PocketCreateWithLinkRequest) => customFetchAPI<PocketCreateWithLinkResponse,PocketCreateWithLinkRequest>({
  url: "/pockets/link-input",
  method: "POST",
  data
})

export default createPocketWithLinkAPI;