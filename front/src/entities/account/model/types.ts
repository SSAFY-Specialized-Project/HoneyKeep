import { Bank } from "@/shared/model/types";

export interface Account {
  accountNumber: string;
  accountBalance: number;
  accountName: string;
  bankName: Bank;
}
