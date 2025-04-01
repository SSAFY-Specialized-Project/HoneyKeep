import { customFetchAPI } from "@/shared/api";
import { Pocket } from "@/entities/pocket/model/types";

const deletePocketAPI = (pocketId: number) =>
  customFetchAPI<Pocket, void>({
    url: `/pockets/${pocketId}`,
    method: "DELETE",
  });

export default deletePocketAPI;
