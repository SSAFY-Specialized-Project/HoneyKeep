import { customFetchAPI } from "@/shared/api";
import { PocketFilterResponse } from "@/entities/pocket/model/types";

interface Props {
  categoryId?: number | null;
  type?: "GATHERING" | "USING" | "COMPLETED" | null;
  isFavorite?: boolean | null;
  startDate?: string | null;
  endDate?: string | null;
}

const getPocketFilterListAPI = ({
  categoryId,
  type,
  isFavorite,
  startDate,
  endDate,
}: Props) =>
  customFetchAPI<PocketFilterResponse, void>({
    url: `/pockets/filter?${categoryId ? `categoryId=${categoryId}` : ""}${type ? `&type=${type}` : ""}${isFavorite ? `&isFavorite=${isFavorite}` : ""}${startDate ? `&startDate=${startDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}`,
    method: "GET",
  });

export default getPocketFilterListAPI;
