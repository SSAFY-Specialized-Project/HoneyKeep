import { customFetchAPI } from "@/shared/api";
import { CategoryWithPocket } from "@/entities/category/model/types";

const getCategoryWithPocket = () => customFetchAPI<CategoryWithPocket[], void>({
  url: "/categories/with-pockets",
  method: "GET",
})

export default getCategoryWithPocket;