import { create } from "zustand";

interface Props {
  isSuccess: boolean;
  productName: string | null;
  productAmount: number | null;
  accountName: string | null;
  payDate: string | null;
  setSuccess: () => void;
  setProductName: (name:string) => void;
  setProductAmount: (amount:number) => void;
  setAccountName: (name:string) => void;
  setPayDate: (date: string) => void;
  cleanData: () => void;
}

const useQRPayStore = create<Props>((set) => ({
  isSuccess: false,
  productName: null,
  productAmount: null,
  accountName: null,
  payDate: null,
  setSuccess: () => set({isSuccess: true}),
  setProductName: (name) => set({productName: name}),
  setProductAmount: (amount) => set({productAmount: amount}),
  setAccountName: (name) => set({accountName: name}),
  setPayDate: (date) => set({payDate: date}),
  cleanData: () => set({isSuccess: false, productName: null, productAmount: null, accountName: null, payDate: null})
}))

export default useQRPayStore;