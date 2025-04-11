import { create } from 'zustand'

interface BudgetState {
  name: string;
  startDate: string | null;
  endDate: string | null;
  accountId: number | null;
  categoryId: number | null;
  totalAmount: number;
  savedAmount: number;
}

interface BudgetActions {
  setBudgetData: (data: BudgetState) => void;
  setName: (name: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setAccountId: (accountId: number) => void;
  setCategoryId: (categoryId: number) => void;
  setTotalAmount: (amount: number) => void;
  setSavedAmount: (amount: number) => void;
  resetBudget: () => void;
}

const initialState: BudgetState = {
  name: "",
  startDate: null,
  endDate: null,
  accountId: null,
  categoryId: null,
  totalAmount: 0,
  savedAmount: 0
}

const usePocketCreateStore = create<BudgetState & BudgetActions>((set) => ({
  ...initialState,
  setBudgetData: (data) => set(data),
  setName: (name) => set({ name }),
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setAccountId: (accountId) => set({ accountId }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setTotalAmount: (totalAmount) => set({ totalAmount }),
  setSavedAmount: (savedAmount) => set({ savedAmount }),
  resetBudget: () => set(initialState)
}))

export default usePocketCreateStore