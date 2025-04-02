import { Pocket } from "@/entities/pocket/model/types";

export interface CategoryWithPocket {
  categoryId: number;
  name: string;
  icon: number;
  pockets: Pocket[];
}

export interface createCategoryRequest {
  name: string,
  icon: number
}

export interface createCategoryResponse {
  categoryId: number;
  name: string;
  icon: number;
}
