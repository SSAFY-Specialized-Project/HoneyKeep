import { customFetchAPI } from "@/shared/api";
import { PocketFilterResponse } from "@/entities/pocket/model/types";

interface Props {
  categoryId?: number;
  type?: "GATHERING" | "USING" | "COMPLETED";
  isFavorite?: boolean;
  startDate?: string;
  endDate?: string;
}

const getPocketFilterListAPI = ({
  categoryId,
  type,
  isFavorite,
  startDate,
  endDate,
}: Props) =>
  customFetchAPI<PocketFilterResponse, void>({
    url: `/pockets/filter?${categoryId ? `categoryId=${categoryId}` : ""}&type=${type}&isFavorite=${isFavorite}&startDate=${startDate}&endDate=${endDate}`,
    method: "GET",
  });

export default getPocketFilterListAPI;
