import { customFetchAPI } from "@/shared/api"
import { createCategoryRequest, createCategoryResponse } from "@/entities/category/model/types"

const createCategoryAPI = (data: createCategoryRequest) => customFetchAPI<createCategoryResponse, createCategoryRequest>({
  url: "/categories",
  method: "POST",
  data
})

export default createCategoryAPI;