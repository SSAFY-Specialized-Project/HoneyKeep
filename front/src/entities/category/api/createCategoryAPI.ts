import { customFetchAPI } from "@/shared/api"
import { createCategoryRequest } from "../model/types"

const createCategoryAPI = () => customFetchAPI<createCategoryRequest, createCategoryRequest>({
  url: "/categories",
  method: "POST",
})

export default createCategoryAPI;