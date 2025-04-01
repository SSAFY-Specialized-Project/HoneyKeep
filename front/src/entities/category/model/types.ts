import { Pocket } from "@/entities/pocket/model/types";

export interface CategoryWithPocket {
  categoryId: number;
  name: string;
  icon: number;
  pockets: Pocket[];
}