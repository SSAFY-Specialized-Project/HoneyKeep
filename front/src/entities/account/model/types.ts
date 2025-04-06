import { Bank } from "@/shared/model/types";

export interface Account {
  accountId: number;
  accountNumber: string;
  accountBalance: number;
  accountName: string;
  bankName: Bank;
  totalPocketAmount: number;
  pocketCount: number;
  spareBalance: number;
}
