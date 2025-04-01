import { customFetchAPI } from "@/shared/api";
import { Pocket } from "@/entities/pocket/model/types";

const getPocketList = () => customFetchAPI<Pocket[], void>({
  url: "/pockets",
  method: "GET",
})

export default getPocketList;