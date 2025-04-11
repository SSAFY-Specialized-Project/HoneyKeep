import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  loadingText: string;
  startLoading: (text:string) => void;
  stopLoading: () => void;
}

const useLoadingStore = create<LoadingState>((set) => ({

  isLoading: false,
  loadingText: "",
  startLoading: (text: string) => {
    set({
      isLoading: true,
      loadingText: text
    });
  },
  stopLoading: () => {
    set({
      isLoading: false,
      loadingText: ""
    });
  }
  
}));

export default useLoadingStore;