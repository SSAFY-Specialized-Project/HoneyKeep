import { Pocket } from '@/entities/pocket/model/types';

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
export interface Category {
  categoryId: number;
  name: string;
  icon: number;
}

export interface CategoryListResponse {
  categories: Category[];
}

export interface CategoryPocketListResponse {
  pockets: Pocket[];
}

export interface CategoryListPocketListResponse {
  categories: CategoryWithPocket[];
}

export interface CategoryCreateRequest {
  name: string;
  icon: number;
}

export interface CategoryCreateResponse {
  categoryId: number;
  name: string;
  icon: number;
}

export interface CategoryUpdateRequest {
  name: string;
  icon: number;
}

export interface CategoryUpdateResponse {
  categoryId: number;
  name: string;
  icon: number;
}

export interface createCategoryResponse {
  categoryId: number;
  name: string;
  icon: number;
}
