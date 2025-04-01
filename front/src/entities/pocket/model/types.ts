export interface Pocket {
  id: number;
  name: string;
  accountName: string;
  totalAmount: number;
  savedAmount: number;
  type: "GATHERING" | "USING" | "COMPLETED";
  isFavorite: boolean;
  imgUrl: string;
  endDate: string;
}