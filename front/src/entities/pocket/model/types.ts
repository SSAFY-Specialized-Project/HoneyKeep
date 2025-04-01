export interface PocketDTO {
  id: number;
  name: string;
  accountName: string;
  totalAmount: number;
  savedAmount: number;
  imgUrl: string;
  type: "GATHERING" | "USING" | "COMPLETED";
  isFavorite: boolean;
  endDate: string;
}