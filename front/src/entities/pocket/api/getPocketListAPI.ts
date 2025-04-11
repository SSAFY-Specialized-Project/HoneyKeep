import { customFetchAPI } from "@/shared/api";
import { Pocket } from "@/entities/pocket/model/types";

const getPocketListAPI = () =>
  customFetchAPI<Pocket[], void>({
    url: "/pockets",
    method: "GET",
  });

export default getPocketListAPI;
