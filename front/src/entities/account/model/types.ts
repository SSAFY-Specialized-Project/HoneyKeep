import { Bank } from "@/shared/model/types";

export interface AccountDTO {
  accountNumber: string;
  accountBalance: number;
  accountName: string;
  bankName: Bank;
}