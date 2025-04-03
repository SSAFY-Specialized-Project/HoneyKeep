import { customFetchAPI } from "@/shared/api";
import { PocketDetail } from "@/entities/pocket/model/types";

const getPocketDetailAPI = (id:string) => customFetchAPI<PocketDetail , void>({
  url: `/pockets/${id}`,
  method: "GET"
})

export default getPocketDetailAPI;